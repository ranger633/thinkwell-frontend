import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const EXERCISES = [
  {
    id: 'box',
    name: 'Box Breathing',
    phases: [
      { label: 'Inhale', duration: 4, color: 'from-sage-400 to-sage-600' },
      { label: 'Hold', duration: 4, color: 'from-moss-400 to-moss-600' },
      { label: 'Exhale', duration: 4, color: 'from-earth-400 to-earth-600' },
      { label: 'Hold', duration: 4, color: 'from-sand-400 to-sand-600' },
    ],
    cycles: 4,
    description: 'Equal intervals of breathing to calm the nervous system'
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    phases: [
      { label: 'Inhale', duration: 4, color: 'from-sage-400 to-sage-600' },
      { label: 'Hold', duration: 7, color: 'from-moss-400 to-moss-600' },
      { label: 'Exhale', duration: 8, color: 'from-earth-400 to-earth-600' },
    ],
    cycles: 4,
    description: 'A natural tranquilizer for the nervous system'
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    phases: [
      { label: 'Inhale', duration: 5, color: 'from-sage-400 to-sage-600' },
      { label: 'Exhale', duration: 7, color: 'from-earth-400 to-earth-600' },
    ],
    cycles: 6,
    description: 'Longer exhale activates the relaxation response'
  },
];

export default function Breathing() {
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);

  const totalPhaseDuration = selectedExercise.phases[currentPhase]?.duration || 4;
  const progress = (timer / totalPhaseDuration) * 100;
  const currentPhaseData = selectedExercise.phases[currentPhase];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev >= totalPhaseDuration) {
            // Move to next phase
            const nextPhase = currentPhase + 1;
            if (nextPhase >= selectedExercise.phases.length) {
              // Move to next cycle
              if (cycle >= selectedExercise.cycles) {
                setIsPlaying(false);
                setCompleted(true);
                clearInterval(intervalRef.current);
                return 0;
              }
              setCycle(c => c + 1);
              setCurrentPhase(0);
            } else {
              setCurrentPhase(nextPhase);
            }
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentPhase, cycle, totalPhaseDuration, selectedExercise]);

  const handleStart = () => {
    setCompleted(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setTimer(0);
    setCycle(1);
    setCompleted(false);
  };

  const handleSelectExercise = (exercise) => {
    handleReset();
    setSelectedExercise(exercise);
  };

  // Calculate circle scale for breathing animation
  const getScale = () => {
    if (!isPlaying && !completed) return 1;
    const phase = currentPhaseData?.label;
    if (phase === 'Inhale') return 1 + (progress / 100) * 0.4;
    if (phase === 'Exhale') return 1.4 - (progress / 100) * 0.4;
    return 1.4; // Hold
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-earth-900">Guided Breathing</h2>
        <p className="text-earth-500 mt-1">Follow the animation to calm your mind and body</p>
      </div>

      {/* Exercise Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {EXERCISES.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => handleSelectExercise(exercise)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedExercise.id === exercise.id
                ? 'bg-sage-600 text-white shadow-md'
                : 'bg-white border border-earth-200 text-earth-600 hover:bg-earth-50'
            }`}
          >
            {exercise.name}
          </button>
        ))}
      </div>

      {/* Breathing Animation */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Outer ring */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-sage-400 to-sage-600'} opacity-20 transition-all duration-500`}
            style={{ transform: `scale(${getScale()})` }}
          />
          {/* Middle ring */}
          <div
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-sage-400 to-sage-600'} opacity-30 transition-all duration-500`}
            style={{ transform: `scale(${getScale()})` }}
          />
          {/* Inner circle */}
          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-sage-400 to-sage-600'} flex items-center justify-center shadow-2xl transition-all duration-500`}
            style={{ transform: `scale(${getScale()})` }}
          >
            <div className="text-center text-white">
              {completed ? (
                <>
                  <p className="text-lg font-bold">Done!</p>
                  <p className="text-xs opacity-80">Great work 🌿</p>
                </>
              ) : isPlaying ? (
                <>
                  <p className="text-xl font-bold">{currentPhaseData?.label}</p>
                  <p className="text-3xl font-bold mt-1">{Math.ceil(totalPhaseDuration - timer)}</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold">Ready</p>
                  <p className="text-xs opacity-80">Press play</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-earth-500">
            Cycle {cycle} of {selectedExercise.cycles}
          </p>
          <div className="flex items-center gap-2 justify-center mt-2">
            {selectedExercise.phases.map((phase, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentPhase && isPlaying ? 'bg-sage-600 scale-125' : i < currentPhase ? 'bg-sage-300' : 'bg-earth-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={handleReset}
          className="p-3 bg-earth-100 hover:bg-earth-200 rounded-xl text-earth-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={isPlaying ? handlePause : handleStart}
          className="p-5 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
        </button>
      </div>

      {/* Exercise Info */}
      <div className="card text-center">
        <h3 className="font-semibold text-earth-900">{selectedExercise.name}</h3>
        <p className="text-sm text-earth-500 mt-1">{selectedExercise.description}</p>
        <div className="flex justify-center gap-4 mt-4">
          {selectedExercise.phases.map((phase, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-earth-400">{phase.label}</p>
              <p className="text-lg font-bold text-earth-700">{phase.duration}s</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
