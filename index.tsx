import React, { useState, useRef, useEffect, Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  ViewProps
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons';

// --- Module Declarations for TypeScript ---
// This tells TypeScript the shape of the modules, fixing the "Cannot find module" error.
declare module 'react-native-camera' {
async (params:true) => {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';
}
  
  export interface TakePictureResponse {
    uri: string;
    base64?: string;
  }

  export interface TakePictureOptions {
    quality?: number;
    base64?: boolean;
    fixOrientation?: boolean;
  }
  
  export class RNCamera extends Component<ViewProps> {
    takePictureAsync(options?: TakePictureOptions): Promise<TakePictureResponse>;
    static Constants: {
        Type: {
            front: any;
            back: any;
        }
    }
  }
}

declare module 'react-native-video' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface VideoProperties extends ViewProps {
    source: { uri: string } | number;
    onEnd?: () => void;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'none';
    style?: any;
    key?: any;
  }

  export default class Video extends Component<VideoProperties> {}
}

declare module 'react-native-sound' {
  export default class Sound {
    constructor(path: any, basePath: any, callback: (error: any) => void);
    play(onEnd?: (success: boolean) => void): void;
    stop(callback?: () => void): void;
    release(): void;
    setNumberOfLoops(loops: number): this;
    static setCategory(category: string): void;
    static MAIN_BUNDLE: any;
  }
}

declare module 'react-native-vector-icons' {
    import { Component } from 'react';
    import { TextProps } from 'react-native';

    export interface IconProps extends TextProps {
        name: string;
        size?: number;
        color?: string;
    }}{

    export default class declare module 'react-native-camera' {
async function name(params:true) {
      import { Component } from 'react';
      import { ViewProps } from 'react-native'; 
}
  
    export interface TakePictureResponse {
      uri: string;
      base64?: string;
    }
  
    export interface TakePictureOptions {
      quality?: number;
      base64?: boolean;
      fixOrientation?: boolean;
    }
    
    }
  }{}



// --- Type Definitions ---
interface PillarCardProps {
  pillar: {
    title: string;
    description: string;
    icon: string;
    color: string;
    quote: string;
    isQuoteLoading: boolean;
  };
  onQuoteChange: (category: string) => void;
  onGuidanceRequest: (pillar: string) => void;
}

interface GuidanceModalProps {
  visible: boolean;
  pillar: string;
  onAsk: (question: string) => void;
  onClose: () => void;
  response: string;
  isLoading: boolean;
}

// --- UI Components ---

const PillarCard: React.FC<PillarCardProps> = ({ pillar, onQuoteChange, onGuidanceRequest }) => {
  const { title, description, icon, color, quote, isQuoteLoading } = pillar;
  const cardStyle = [styles.pillarCard, { borderTopColor: color, borderTopWidth: 5 }];

  return (
    <View style={cardStyle}>
      <View style={styles.cardHeader}>
        
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <View style={styles.quoteSection}>
        <Text style={styles.cardQuote}>
          {isQuoteLoading ? <ActivityIndicator color={color} /> : `"${quote}"`}
        </Text>
        <TouchableOpacity onPress={() => onQuoteChange(title.toLowerCase())} style={styles.refreshButton} disabled={isQuoteLoading}>
        
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.guidanceButton} onPress={() => onGuidanceRequest(title)}>
       
        <Text style={styles.guidanceButtonText}>Ask for Guidance</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProcessingOverlay = ({ text }: { text: string }) => (
  <View style={styles.processingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.processingText}>{text}</Text>
    <Text style={styles.processingSubtext}>This may take a moment.</Text>
  </View>
);

const GuidanceModal: React.FC<GuidanceModalProps> = ({ visible, pillar, onAsk, onClose, response, isLoading }) => {
    const [question, setQuestion] = useState('');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Guidance for {pillar}</Text>
                    <Text style={styles.modalPrompt}>What challenge are you facing or what question is on your mind regarding {pillar.toLowerCase()}?</Text>
                    <TextInput 
                        style={styles.modalTextarea}
                        placeholder={`e.g., "How can I build healthier eating habits?"`}
                        value={question}
                        onChangeText={setQuestion}
                        multiline={true}
                    />
                    <TouchableOpacity style={[styles.modalAskButton, (isLoading || !question) && {backgroundColor: '#ccc'}]} onPress={() => onAsk(question)} disabled={isLoading || !question}>
                        <Text style={styles.modalAskButtonText}>{isLoading ? 'Thinking...' : 'Get Guidance'}</Text>
                    </TouchableOpacity>
                    {response && (
                        <ScrollView style={styles.modalResponse}>
                            <Text style={styles.modalResponseTitle}>A Thought for You:</Text>
                            <Text>{response}</Text>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [quotes, setQuotes] = useState({
    wealth: "Wealth is the ability to fully experience life.",
    health: "The first wealth is health.",
    relationships: "The best thing to hold onto in life is each other.",
  });
  const [quoteLoading, setQuoteLoading] = useState({ wealth: false, health: false, relationships: false });
  const [videoVisible, setVideoVisible] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [playCount, setPlayCount] = useState(0);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<'alpha' | 'delta' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [guidanceModal, setGuidanceModal] = useState({ isOpen: false, pillar: '', response: '', isLoading: false });
  
  const cameraRef = useRef<RNCamera>(null);
  const alphaAudioRef = useRef<Sound | null>(null);
  const deltaAudioRef = useRef<Sound | null>(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    alphaAudioRef.current = new Sound('alpha_waves.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) console.log('Failed to load alpha sound', error);
    });
    deltaAudioRef.current = new Sound('delta_waves.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) console.log('Failed to load delta sound', error);
    });

    return () => {
        alphaAudioRef.current?.release();
        deltaAudioRef.current?.release();
    };
  }, []);

  // --- Gemini API Integration ---
  const callGeminiAPI = async (prompt: string) => {
    const apiKey = ""; // Leave as-is
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API call failed: ${response.status}`);
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Gemini API call error:", error);
        return "Error connecting to the AI. Please try again.";
    }
  };

  const generateNewQuote = async (category: string) => {
    setQuoteLoading(prev => ({...prev, [category]: true}));
    const prompt = `Generate a short, inspiring, and profound quote about ${category}.`;
    const newQuote = await callGeminiAPI(prompt);
    setQuotes(prev => ({ ...prev, [category]: newQuote.replace(/"/g, '') }));
    setQuoteLoading(prev => ({...prev, [category]: false}));
  };
  
  const handleGuidanceRequest = (pillar: string) => {
    setGuidanceModal({ isOpen: true, pillar, response: '', isLoading: false });
  };

  const getAiGuidance = async (question: string) => {
    const { pillar } = guidanceModal;
    setGuidanceModal(prev => ({ ...prev, isLoading: true }));
    const prompt = `You are a wise and compassionate life coach. A user is asking for guidance on '${pillar}'. Their question is: "${question}". Provide a short, encouraging, and actionable reflection in 2-3 paragraphs.`;
    const response = await callGeminiAPI(prompt);
    setGuidanceModal(prev => ({ ...prev, response, isLoading: false }));
  };

  const handleVideoEnd = () => {
    if (playCount < 99) setPlayCount(prev => prev + 1);
    else { setVideoVisible(false); setPlayCount(0); }
  };

  const toggleSound = (soundType: 'alpha' | 'delta') => {
    const soundToPlay = soundType === 'alpha' ? alphaAudioRef.current : deltaAudioRef.current;
    const otherSound = soundType === 'alpha' ? deltaAudioRef.current : alphaAudioRef.current;
    if (soundPlaying === soundType) {
      soundToPlay?.stop();
      setSoundPlaying(null);
    } else {
      otherSound?.stop();
      soundToPlay?.setNumberOfLoops(-1).play((success: any) => {
          if (!success) console.log('Sound playback failed');
      });
      setSoundPlaying(soundType);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, fixOrientation: true };
        const data = await cameraRef.current.takePictureAsync(options);
        setProfilePic(data.uri);
        setIsCameraVisible(false);
    }
  };

  const generateVisualizationVideo = async () => {
    if (!profilePic) { alert("Please set a profile picture first."); return; }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    setGeneratedVideoUrl(videoUrl);
    setIsProcessing(false);
    setVideoVisible(true);
  };

  const pillarsData = [
    { title: 'Health', description: 'Physical and mental well-being forms the foundation of a fulfilling life.', icon: 'heart-pulse', color: '#808080', quote: quotes.health, isQuoteLoading: quoteLoading.health },
    { title: 'Relationships', description: 'Strong connections with others provide support, joy, and a sense of belonging.', icon: 'account-group', color: '#00008B', quote: quotes.relationships, isQuoteLoading: quoteLoading.relationships },
    { title: 'Wealth', description: 'True wealth is the freedom and resources to live authentically and make an impact.', icon: 'diamond-stone', color: '#4169E1', quote: quotes.wealth, isQuoteLoading: quoteLoading.wealth },
  ];

  // --- RENDER LOGIC ---

  if (isCameraVisible) {
    return (
      <View style={{flex: 1}}>
        <RNCamera ref={cameraRef} style={{flex: 1}} type={RNCamera.Constants.Type.front} captureAudio={false} />
        <View style={styles.cameraControls}>
          <TouchableOpacity onPress={() => setIsCameraVisible(false)} style={styles.cameraButton}></TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.cameraButton}></TouchableOpacity>
        </View>
      </View>
    );
  }

  if (videoVisible) {
    return (
      <View style={styles.videoContainer}>
        <Video source={{uri: generatedVideoUrl}} style={styles.videoPlayer} onEnd={handleVideoEnd} key={playCount} resizeMode="cover" />
        <View style={styles.videoOverlay}>
          <Text style={styles.counterText}>Views: {playCount + 1} / 100</Text>
          <TouchableOpacity onPress={() => setVideoVisible(false)} style={styles.closeVideoButton}></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <Modal transparent={true} visible={isProcessing}>
            <ProcessingOverlay text="Creating your personal visualization..." />
        </Modal>
        <GuidanceModal visible={guidanceModal.isOpen} {...guidanceModal} onAsk={getAiGuidance} onClose={() => setGuidanceModal({isOpen: false, pillar: '', response: '', isLoading: false})} />
        
        <View style={styles.header}>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setIsCameraVisible(true)}>
                    <Image source={profilePic ? { uri: profilePic } : require('./assets/placeholder.png')} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.profileText}>Tap to set picture</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={generateVisualizationVideo}>
                <Text style={styles.playButtonText}>Generate My Visualization</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.mainContent}>
            {pillarsData.map(pillar => <PillarCard key={pillar.title} pillar={pillar} onQuoteChange={generateNewQuote} onGuidanceRequest={handleGuidanceRequest} />)}
        </ScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.soundButton} onPress={() => toggleSound('alpha')}><Text style={styles.soundButtonText}>Alpha</Text>{soundPlaying === 'alpha' }</TouchableOpacity>
            <TouchableOpacity style={styles.soundButton} onPress={() => toggleSound('delta')}><Text style={styles.soundButtonText}>Delta</Text>{soundPlaying === 'delta' }</TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#4169E1', backgroundColor: '#e0e0e0' },
  profileText: { marginTop: 5, color: '#808080', fontSize: 14, fontFamily: 'Comic Sans MS' },
  playButton: { backgroundColor: '#4169E1', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, elevation: 5 },
  playButtonText: { color: '#fff', fontSize: 18, fontFamily: 'Impact' },
  mainContent: { paddingHorizontal: 20, paddingBottom: 20 },
  pillarCard: { backgroundColor: '#ffffff', borderRadius: 15, padding: 25, marginBottom: 20, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { marginLeft: 15, fontSize: 28, color: '#333', fontFamily: 'Impact' },
  cardDescription: { color: '#555', lineHeight: 22, marginBottom: 20, fontFamily: 'Comic Sans MS' },
  quoteSection: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 15 },
  cardQuote: { fontStyle: 'italic', color: '#333', minHeight: 60, fontFamily: 'Comic Sans MS' },
  refreshButton: { position: 'absolute', right: 0, bottom: 10 },
  guidanceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingVertical: 10, borderWidth: 1, borderColor: '#c59f2c', borderRadius: 8, backgroundColor: '#fdfbfb' },
  guidanceButtonText: { color: '#c59f2c', marginLeft: 8, fontFamily: 'Impact' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, borderTopWidth: 1, borderColor: '#e0e0e0' },
  soundButton: { backgroundColor: '#00008B', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  soundButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Impact', marginRight: 10 },
  videoContainer: { flex: 1, backgroundColor: 'black' },
  videoPlayer: { ...StyleSheet.absoluteFillObject },
  videoOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20 },
  counterText: { color: 'white', fontSize: 22, fontFamily: 'Impact', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10, alignSelf: 'center' },
  closeVideoButton: { alignSelf: 'flex-start' },
  cameraControls: { position: 'absolute', bottom: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  cameraButton: { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 40, padding: 15 },
  processingOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 20, 60, 0.85)' },
  processingText: { color: 'white', fontFamily: 'Impact', fontSize: 24, marginTop: 20, letterSpacing: 1 },
  processingSubtext: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, marginTop: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: '90%', maxHeight: '80%', elevation: 10 },
  modalCloseButton: { position: 'absolute', top: 10, right: 10 },
  modalTitle: { fontFamily: 'Impact', fontSize: 22, marginBottom: 10 },
  modalPrompt: { fontFamily: 'Comic Sans MS', marginBottom: 15 },
  modalTextarea: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, height: 100, textAlignVertical: 'top', marginBottom: 15 },
  modalAskButton: { paddingVertical: 12, borderRadius: 8, backgroundColor: '#4169E1' },
  modalAskButtonText: { color: 'white', fontFamily: 'Impact', fontSize: 18, textAlign: 'center' },
  modalResponse: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderColor: '#eee' },
  modalResponseTitle: { fontWeight: 'bold', marginBottom: 5 },
});

export default App;
