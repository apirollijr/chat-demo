import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { getAuthInstance } from '../firebase';
import { storageBucketName } from '../firebase';

/**
 * CustomActions
 * - Renders an accessible button inside GiftedChat's input
 * - Shows a custom ActionSheet with options to pick image, take photo, or share location
 * - Uploads images to Firebase Storage and sends messages via onSend
 */
const CustomActions = ({ storage, onSend, user, isConnected }) => {
  const [visible, setVisible] = useState(false);

  const currentUser = useMemo(() => ({
    _id: user?._id,
    name: user?.name,
  }), [user?._id, user?.name]);

  const close = useCallback(() => setVisible(false), []);
  const open = useCallback(() => setVisible(true), []);

  const ensureConnected = useCallback(() => {
    if (!isConnected) {
      Alert.alert('Offline', 'You need an internet connection to use this feature.');
      return false;
    }
    return true;
  }, [isConnected]);

  // Helper: upload file from local URI to Storage and return downloadURL
  const uploadImageAsync = useCallback(async (uri, folder = 'uploads') => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const extMatch = /\.([a-zA-Z0-9]+)(?:\?|$)/.exec(uri);
    const ext = extMatch?.[1] || 'jpg';
    const path = `${folder}/${currentUser._id || 'anon'}/${Date.now()}_${Math.floor(Math.random()*1e6)}.${ext}`;
    const storageRef = ref(storage, path);
    const metadata = { contentType: blob.type || 'image/jpeg' };

    // 1) Try SDK uploadBytes with Blob
    try {
      await uploadBytes(storageRef, blob, metadata);
      return await getDownloadURL(storageRef);
    } catch (err1) {
      // 2) Fallback: uploadString with base64 to avoid Blob transport quirks
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await uploadString(storageRef, base64, 'base64', metadata);
        return await getDownloadURL(storageRef);
      } catch (err2) {
        // 3) Fallback: direct REST upload for clear server errors
        try {
          const auth = getAuthInstance();
          const idToken = await auth.currentUser?.getIdToken?.();
          // Firebase Storage REST (v0) upload: POST to /o?name=<path> with raw body
          const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucketName}/o?name=${encodeURIComponent(path)}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': metadata.contentType,
              ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
            },
            body: blob,
          });
          if (!res.ok) {
            const text = await res.text();
            if (res.status === 404) {
              throw new Error(`REST upload failed: 404 Not Found. Bucket '${storageBucketName}' may not exist or Storage is not enabled. Response: ${text}`);
            }
            throw new Error(`REST upload failed: ${res.status} ${res.statusText} ${text}`);
          }
          return await getDownloadURL(storageRef);
        } catch (err3) {
          // Re-throw deepest error to be handled by caller
          throw err3 || err2 || err1;
        }
      }
    }
  }, [storage, currentUser._id]);

  const pickImage = useCallback(async () => {
    try {
      if (!ensureConnected()) return;
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need media library permission to select images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const downloadURL = await uploadImageAsync(asset.uri, 'images');

      onSend([
        {
          _id: `${Date.now()}-${Math.random()}`,
          createdAt: new Date(),
          text: '',
          image: downloadURL,
          user: currentUser,
        },
      ]);
    } catch (e) {
      console.warn('Image selection/upload failed:', e);
      const code = e?.code || 'unknown';
      const server = e?.customData?.serverResponse || '';
      Alert.alert('Image selection failed', `Firebase Storage: ${e?.message || e}\nCode: ${code}${server ? `\nServer: ${server}` : ''}`);
    } finally {
      close();
    }
  }, [ensureConnected, uploadImageAsync, onSend, currentUser, close]);

  const takePhoto = useCallback(async () => {
    try {
      if (!ensureConnected()) return;
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera permission to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const downloadURL = await uploadImageAsync(asset.uri, 'photos');

      onSend([
        {
          _id: `${Date.now()}-${Math.random()}`,
          createdAt: new Date(),
          text: '',
          image: downloadURL,
          user: currentUser,
        },
      ]);
    } catch (e) {
      console.warn('Photo capture/upload failed:', e);
      const code = e?.code || 'unknown';
      const server = e?.customData?.serverResponse || '';
      Alert.alert('Photo capture failed', `Firebase Storage: ${e?.message || e}\nCode: ${code}${server ? `\nServer: ${server}` : ''}`);
    } finally {
      close();
    }
  }, [ensureConnected, uploadImageAsync, onSend, currentUser, close]);

  const shareLocation = useCallback(async () => {
    try {
      if (!ensureConnected()) return;
      // 1) Permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need location permission to share your location.');
        return;
      }

      // 2) Make sure location services are ON (on emulators this is often OFF by default)
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location services are off',
          Platform.select({
            android:
              'Turn on Location in the emulator: Settings > Location (Use location ON), then set a mock location via Extended controls > Location.',
            ios:
              'Turn on Location Services in the simulator: Features > Location > choose a preset.',
            default:
              'Please enable device location services and try again.',
          })
        );
        return;
      }

      // 3) Try a fast accurate read, then progressively relax and finally fall back to last known
      let position = null;
      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 10000,
          timeout: 7000,
        });
      } catch (_) {}

      if (!position) {
        try {
          position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            maximumAge: 30000,
            timeout: 7000,
          });
        } catch (_) {}
      }

      if (!position) {
        try {
          position = await Location.getLastKnownPositionAsync();
        } catch (_) {}
      }

      const { latitude, longitude } = position?.coords || {};
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        // Helpful emulator tips when no fix is available
        const tip = Platform.OS === 'android'
          ? 'In Android Emulator, open Extended controls (⋮) > Location and press Set Location (or select a preset like San Francisco).'
          : 'In iOS Simulator, use Features > Location > select a preset (e.g., Apple).';
        Alert.alert('Current location is unavailable', `${tip}`);
        return;
      }

      onSend([
        {
          _id: `${Date.now()}-${Math.random()}`,
          createdAt: new Date(),
          text: '',
          location: { latitude, longitude },
          user: currentUser,
        },
      ]);
    } catch (e) {
      Alert.alert('Location sharing failed', e?.message || String(e));
    } finally {
      close();
    }
  }, [ensureConnected, onSend, currentUser, close]);

  // The small button shown inside the input toolbar
  const ActionButton = (
    <TouchableOpacity
      onPress={open}
      style={styles.button}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Open attachment and location options"
      accessibilityHint="Opens a menu to select an image, take a photo, or share your location"
    >
      <View style={styles.buttonIcon} />
    </TouchableOpacity>
  );

  return (
    <>
      {isConnected ? ActionButton : null}

      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={close}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Add to your message</Text>

            <TouchableOpacity style={styles.option} onPress={pickImage} accessible accessibilityRole="button" accessibilityLabel="Select an image from library">
              <Text style={styles.optionText}>Select an image from library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={takePhoto} accessible accessibilityRole="button" accessibilityLabel="Take a photo">
              <Text style={styles.optionText}>Take a photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={shareLocation} accessible accessibilityRole="button" accessibilityLabel="Share location">
              <Text style={styles.optionText}>Share location</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, styles.cancel]} onPress={close} accessible accessibilityRole="button" accessibilityLabel="Cancel">
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 5,
    marginBottom: 5,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#007AFF',
  },
  cancel: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    marginTop: 8,
  },
  cancelText: {
    color: '#FF3B30',
  },
});

export default CustomActions;
