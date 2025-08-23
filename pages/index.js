import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';

const onboardingSteps = [
  {
    message: "Hey there! 😊 What's your name?",
    placeholder: "Type your name...",
    field: 'userName'
  },
  {
    message: "Nice to meet you, {userName}! 💫 Want to give me a special name?",
    placeholder: "Or keep \"{girlName}\" ✨",
    field: 'girlName'
  },
  {
    message: "Perfect! Tell me about yourself, {userName}! What do you love doing? 🌟",
    placeholder: "I enjoy gaming, music, sports...",
    field: 'userHobbies'
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedGirl, setSelectedGirl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({
    userName: '',
    girlName: '',
    userHobbies: ''
  });

  useEffect(() => {
    // Get selected girl from localStorage
    if (typeof window !== 'undefined') {
      const girl = localStorage.getItem('selectedGirl');
      if (!girl) {
        router.push('/');
        return;
      }
      const parsedGirl = JSON.parse(girl);
      setSelectedGirl(parsedGirl);
      setUserData(prev => ({ ...prev, girlName: parsedGirl.name }));
    }
  }, [router]);

  const handleNext = () => {
    const step = onboardingSteps[currentStep];
    const value = document.getElementById('onboarding-input')?.value.trim();

    // Validation (allow empty girlName)
    if (!value && currentStep !== 1) return;

    // Save input
    setUserData(prev => ({
      ...prev,
      [step.field]: value || prev[step.field]
    }));

    if (currentStep < onboardingSteps.length - 1) {
      // Show typing animation
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStep(currentStep + 1);
      }, 1500);
    } else {
      // Complete onboarding and go to chat
      const completeUserData = {
        ...userData,
        [step.field]: value || userData[step.field],
        selectedGirl,
        onboardingComplete: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(completeUserData));
        router.push('/chat');
      }
    }
  };

  const getCurrentMessage = () => {
    const step = onboardingSteps[currentStep];
    return step.message
      .replace('{userName}', userData.userName)
      .replace('{girlName}', selectedGirl?.name || '');
  };

  const getCurrentPlaceholder = () => {
    const step = onboardingSteps[currentStep];
    return step.placeholder
      .replace('{userName}', userData.userName)
      .replace('{girlName}', selectedGirl?.name || '');
  };

  if (!selectedGirl) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Onboarding - AI Girlfriend</title>
        <meta name="description" content="Get to know your AI companion through our flirty onboarding process" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-gradient flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Girl Avatar */}
          <motion.div
            className="text-center mb-12"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <div className="relative inline-block">
              <motion.img
                src={selectedGirl.image}
                alt={selectedGirl.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-2xl mx-auto"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Floating decorations */}
              <motion.div
                className="absolute -top-2 -right-2 text-2xl"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-2 text-2xl"
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                💫
              </motion.div>
            </div>

            <motion.h2
              className="text-2xl font-bold text-white mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {selectedGirl.name}
            </motion.h2>
          </motion.div>

          {/* Chat Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="bg-dark-card/95 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-dark-border/50 shadow-2xl relative"
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {/* Speech bubble tail */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[20px] border-l-transparent border-r-transparent border-b-gray-800"></div>
              </div>

              {/* Typing Animation */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-gray-400 mb-6"
                  >
                    <span>Typing</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Content */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6 text-center leading-relaxed">
                    {getCurrentMessage()}
                  </h2>

                  <div className="mb-6">
                    <input
                      id="onboarding-input"
                      type="text"
                      className="w-full p-4 bg-gray-800/80 border border-gray-600/50 rounded-xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                      placeholder={getCurrentPlaceholder()}
                      defaultValue={userData[onboardingSteps[currentStep]?.field] || ''}
                      onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                      autoFocus
                    />
                  </div>

                  <motion.button
                    onClick={handleNext}
                    className="w-full bg-blue-gradient text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-3">
                      {currentStep === onboardingSteps.length - 1 ? (
                        <>
                          Start Chatting
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ✨
                          </motion.span>
                        </>
                      ) : (
                        <>
                          Continue
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex justify-center gap-3 mb-4">
              {onboardingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-600'
                  }`}
                  animate={index <= currentStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Step {currentStep + 1} of {onboardingSteps.length}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
