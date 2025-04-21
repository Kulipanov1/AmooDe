import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, Plus, ChevronRight, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/store/useUserStore';
import { interests } from '@/mocks/interests';
import Colors from '@/constants/colors';
import { useTelegramWebApp } from '@/components/TelegramWebAppProvider';

const steps = [
  'photos',
  'basic',
  'interests',
  'preferences',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setCurrentUser, setOnboarded } = useUserStore();
  const { isTelegram, telegramUser } = useTelegramWebApp();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([
    // Add a default photo to avoid empty state issues
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
  ]);
  const [name, setName] = useState('Alex');
  const [age, setAge] = useState('28');
  const [bio, setBio] = useState("I'm a software developer who loves hiking and photography. Looking for someone to share adventures with!");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Hiking', 'Photography']);
  const [gender, setGender] = useState('Man');
  const [lookingFor, setLookingFor] = useState<string[]>(['Women']);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [distanceRange, setDistanceRange] = useState(25);
  
  // Pre-fill data from Telegram if available
  useEffect(() => {
    if (Platform.OS === 'web' && isTelegram && telegramUser) {
      setName(telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''));
      if (telegramUser.photo_url) {
        setPhotos([telegramUser.photo_url]);
      }
    }
  }, [isTelegram, telegramUser]);
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      // Use a fallback image if image picker fails
      setPhotos([...photos, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80']);
    }
  };
  
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };
  
  const handleGenderSelect = (selected: string) => {
    setGender(selected);
  };
  
  const handleLookingForToggle = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(i => i !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeOnboarding = () => {
    // Create user profile
    setCurrentUser({
      id: 'current',
      name,
      age: parseInt(age),
      bio,
      location: 'New York', // Default location
      photos,
      interests: selectedInterests,
      gender,
      lookingFor,
      ageRange,
      distanceRange,
    });
    
    setOnboarded(true);
    router.push('/(tabs)');
  };
  
  const isNextDisabled = () => {
    switch (steps[currentStep]) {
      case 'photos':
        return photos.length === 0;
      case 'basic':
        return !name || !age || !bio;
      case 'interests':
        return selectedInterests.length === 0;
      case 'preferences':
        return !gender || lookingFor.length === 0;
      default:
        return false;
    }
  };
  
  const renderPhotosStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add your best photos</Text>
      <Text style={styles.stepDescription}>
        Add at least 1 photo to create your profile. Choose photos that show the real you!
      </Text>
      
      <View style={styles.photosGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
          </View>
        ))}
        
        {photos.length < 6 && (
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Camera size={32} color={Colors.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  const renderBasicInfoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepDescription}>
        This information will be shown on your profile.
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Your age"
          value={age}
          onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Write a short bio about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={150}
        />
        <Text style={styles.charCount}>{bio.length}/150</Text>
      </View>
    </View>
  );
  
  const renderInterestsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What are your interests?</Text>
      <Text style={styles.stepDescription}>
        Select up to 5 interests to help us find better matches for you.
      </Text>
      
      <View style={styles.interestsContainer}>
        {interests.map((interest, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.interestBadge,
              selectedInterests.includes(interest) && styles.selectedInterestBadge
            ]}
            onPress={() => handleInterestToggle(interest)}
          >
            <Text 
              style={[
                styles.interestText,
                selectedInterests.includes(interest) && styles.selectedInterestText
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.selectionCount}>
        {selectedInterests.length}/5 selected
      </Text>
    </View>
  );
  
  const renderPreferencesStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your preferences</Text>
      <Text style={styles.stepDescription}>
        Tell us what you're looking for to help us find better matches.
      </Text>
      
      <View style={styles.preferencesSection}>
        <Text style={styles.preferenceLabel}>I am</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              gender === 'Woman' && styles.selectedOptionButton
            ]}
            onPress={() => handleGenderSelect('Woman')}
          >
            <Text 
              style={[
                styles.optionText,
                gender === 'Woman' && styles.selectedOptionText
              ]}
            >
              Woman
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              gender === 'Man' && styles.selectedOptionButton
            ]}
            onPress={() => handleGenderSelect('Man')}
          >
            <Text 
              style={[
                styles.optionText,
                gender === 'Man' && styles.selectedOptionText
              ]}
            >
              Man
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              gender === 'Other' && styles.selectedOptionButton
            ]}
            onPress={() => handleGenderSelect('Other')}
          >
            <Text 
              style={[
                styles.optionText,
                gender === 'Other' && styles.selectedOptionText
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.preferencesSection}>
        <Text style={styles.preferenceLabel}>Looking for</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              lookingFor.includes('Women') && styles.selectedOptionButton
            ]}
            onPress={() => handleLookingForToggle('Women')}
          >
            <Text 
              style={[
                styles.optionText,
                lookingFor.includes('Women') && styles.selectedOptionText
              ]}
            >
              Women
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              lookingFor.includes('Men') && styles.selectedOptionButton
            ]}
            onPress={() => handleLookingForToggle('Men')}
          >
            <Text 
              style={[
                styles.optionText,
                lookingFor.includes('Men') && styles.selectedOptionText
              ]}
            >
              Men
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              lookingFor.includes('Everyone') && styles.selectedOptionButton
            ]}
            onPress={() => handleLookingForToggle('Everyone')}
          >
            <Text 
              style={[
                styles.optionText,
                lookingFor.includes('Everyone') && styles.selectedOptionText
              ]}
            >
              Everyone
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case 'photos':
        return renderPhotosStep();
      case 'basic':
        return renderBasicInfoStep();
      case 'interests':
        return renderInterestsStep();
      case 'preferences':
        return renderPreferencesStep();
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[Colors.gradient.start, Colors.gradient.end]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Create Your Profile</Text>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressDot,
                index <= currentStep && styles.activeDot
              ]} 
            />
          ))}
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
      
      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, isNextDisabled() && styles.disabledButton]} 
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {Platform.OS === 'web' && (
        <View style={styles.telegramAuthContainer}>
          <Text style={styles.telegramAuthText}>Already have a Telegram account?</Text>
          <TouchableOpacity 
            style={styles.telegramAuthButton}
            onPress={() => {
              // In a real app, this would redirect to Telegram login
              window.open('https://t.me/AmooBot', '_blank');
            }}
          >
            <Send size={18} color="#FFFFFF" style={styles.telegramIcon} />
            <Text style={styles.telegramAuthButtonText}>Login with Telegram</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 24,
    lineHeight: 22,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  photoContainer: {
    width: '33.33%',
    aspectRatio: 0.8,
    padding: 6,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addPhotoButton: {
    width: '33.33%',
    aspectRatio: 0.8,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    color: Colors.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: Colors.subtext,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    margin: 4,
  },
  selectedInterestBadge: {
    backgroundColor: Colors.primary,
  },
  interestText: {
    color: Colors.text,
    fontSize: 14,
  },
  selectedInterestText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectionCount: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 16,
    textAlign: 'center',
  },
  preferencesSection: {
    marginBottom: 24,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  selectedOptionButton: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  telegramAuthContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  telegramAuthText: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  telegramAuthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0088cc', // Telegram blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  telegramIcon: {
    marginRight: 8,
  },
  telegramAuthButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});