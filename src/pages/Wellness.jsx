import { useState, useEffect } from 'react';
import { Wind, Heart, Sparkles, Moon, Leaf, Lightbulb, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const CATEGORIES = [
  { id: 'breathing', icon: Wind, label: 'Breathing', color: 'bg-sage-100 text-sage-700' },
  { id: 'meditation', icon: Sparkles, label: 'Meditation', color: 'bg-moss-100 text-moss-700' },
  { id: 'grounding', icon: Leaf, label: 'Grounding', color: 'bg-earth-100 text-earth-700' },
  { id: 'yoga', icon: Heart, label: 'Yoga', color: 'bg-clay-100 text-clay-700' },
  { id: 'sleep', icon: Moon, label: 'Sleep Tips', color: 'bg-sand-100 text-sand-700' },
  { id: 'copingStrategies', icon: Lightbulb, label: 'CBT Coping', color: 'bg-moss-100 text-moss-700' },
];

const LOCAL_PLANS = {
  breathing: [
    { id: 'box', name: 'Box Breathing', description: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s', duration: '4 min', benefit: 'Reduces anxiety & calms nervous system', steps: ['Inhale slowly for 4 seconds', 'Hold your breath for 4 seconds', 'Exhale slowly for 4 seconds', 'Hold empty for 4 seconds', 'Repeat 4 times'] },
    { id: '478', name: '4-7-8 Breathing', description: 'Inhale 4s → Hold 7s → Exhale 8s', duration: '5 min', benefit: 'Natural tranquilizer, helps with sleep', steps: ['Inhale through nose for 4 seconds', 'Hold breath for 7 seconds', 'Exhale through mouth for 8 seconds', 'Repeat 3-4 times'] },
    { id: 'belly', name: 'Deep Belly Breathing', description: 'Breathe deeply into diaphragm', duration: '5 min', benefit: 'Activates parasympathetic system', steps: ['Place one hand on chest, one on belly', 'Breathe in deeply through nose', 'Feel belly rise (not chest)', 'Exhale slowly through pursed lips', 'Repeat 10 times'] },
  ],
  meditation: [
    { id: 'body', name: 'Body Scan', description: 'Progressive relaxation from head to toes', duration: '10 min', benefit: 'Releases tension, improves body awareness' },
    { id: 'mindful', name: 'Mindfulness', description: 'Focus on breath and present moment', duration: '10 min', benefit: 'Reduces rumination, improves focus' },
    { id: 'loving', name: 'Loving Kindness', description: 'Send compassion to yourself and others', duration: '15 min', benefit: 'Increases empathy, reduces negative self-talk' },
  ],
  grounding: [
    { id: '54321', name: '5-4-3-2-1 Technique', description: '5 see, 4 touch, 3 hear, 2 smell, 1 taste', duration: '5 min', benefit: 'Stops panic spirals, brings to present', steps: ['Name 5 things you can see', 'Name 4 things you can touch', 'Name 3 things you can hear', 'Name 2 things you can smell', 'Name 1 thing you can taste'] },
    { id: 'ice', name: 'Ice Cube Technique', description: 'Hold ice and focus on the sensation', duration: '2 min', benefit: 'Interrupts dissociation and panic' },
  ],
  yoga: [
    { id: 'morning', name: 'Morning Stretch', description: 'Gentle poses for calm energy', duration: '15 min', poses: ['Cat-Cow', "Child's Pose", 'Downward Dog', 'Forward Fold', 'Mountain Pose'] },
    { id: 'anxiety', name: 'Anxiety Relief', description: 'Poses that calm the nervous system', duration: '20 min', poses: ['Legs Up Wall', 'Supported Bridge', 'Reclined Butterfly', 'Corpse Pose'] },
  ],
  sleep: [
    { id: 'hygiene', name: 'Sleep Hygiene', tips: ['Consistent sleep schedule', 'No screens 1 hour before bed', 'Keep room cool & dark', 'No caffeine after 2 PM', 'Journal before bed', 'Try 4-7-8 breathing'] },
  ],
  copingStrategies: [
    { id: 'reframe', name: 'Cognitive Reframing', description: 'Challenge negative thoughts with alternative perspectives', steps: ['Identify the negative thought', 'Ask: Is this based on facts?', 'Consider alternative explanations', 'Choose a more balanced view'] },
    { id: 'thought', name: 'Thought Record', description: 'Structured approach to examining thoughts', steps: ['Describe the situation', 'Note the automatic thought', 'Rate the emotion (0-100%)', 'List evidence for & against', 'Create a balanced thought'] },
  ]
};

export default function Wellness() {
  const [activeCategory, setActiveCategory] = useState('breathing');
  const [plans, setPlans] = useState(LOCAL_PLANS);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchRecommendations();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/wellness/plans');
      if (res.data.plans) setPlans(res.data.plans);
    } catch (err) {
      // Use local plans
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/wellness/recommendations');
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      setRecommendations([
        { type: 'breathing', item: LOCAL_PLANS.breathing[0], reason: 'Great for daily stress management' },
        { type: 'meditation', item: LOCAL_PLANS.meditation[1], reason: 'Build mindfulness practice' },
      ]);
    }
  };

  const currentPlans = plans[activeCategory] || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-earth-900">Wellness & Recovery</h2>
        <p className="text-sm text-earth-500 mt-1">Personalized tools for your mental well-being journey</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-sage-700 mb-3 uppercase tracking-wide">Recommended for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-gradient-to-r from-sage-50 to-moss-50 border border-sage-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-sage-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-900 text-sm">{rec.item?.name}</p>
                  <p className="text-xs text-earth-500 mt-0.5">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSelectedPlan(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-sage-600 text-white shadow-md'
                : 'bg-white border border-earth-200 text-earth-600 hover:bg-earth-50'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Plan Detail */}
      {selectedPlan && (
        <div className="card mb-6 border-sage-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-earth-900">{selectedPlan.name}</h3>
            <button onClick={() => setSelectedPlan(null)} className="text-earth-400 hover:text-earth-600 text-sm font-medium">Close</button>
          </div>
          <p className="text-earth-600 mb-4">{selectedPlan.description}</p>

          {selectedPlan.duration && (
            <p className="text-sm text-earth-500 mb-2">⏱ Duration: {selectedPlan.duration}</p>
          )}
          {selectedPlan.benefit && (
            <p className="text-sm text-sage-600 mb-4">✨ {selectedPlan.benefit}</p>
          )}

          {selectedPlan.steps && (
            <div className="bg-earth-50 rounded-xl p-4">
              <h4 className="font-semibold text-earth-800 mb-3">Steps:</h4>
              <ol className="space-y-2">
                {selectedPlan.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-earth-700">
                    <span className="w-6 h-6 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {selectedPlan.poses && (
            <div className="bg-earth-50 rounded-xl p-4">
              <h4 className="font-semibold text-earth-800 mb-3">Poses:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPlan.poses.map((pose, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white border border-earth-200 rounded-full text-sm text-earth-700">{pose}</span>
                ))}
              </div>
            </div>
          )}

          {selectedPlan.tips && (
            <div className="bg-earth-50 rounded-xl p-4">
              <ul className="space-y-2">
                {selectedPlan.tips.map((tip, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-earth-700">
                    <span className="text-sage-500">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className="card cursor-pointer hover:border-sage-200 group flex items-center gap-4"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-earth-900 group-hover:text-sage-700 transition-colors">{plan.name}</h4>
              <p className="text-sm text-earth-500 mt-1">{plan.description || (plan.tips ? `${plan.tips.length} tips` : '')}</p>
              {plan.duration && <p className="text-xs text-earth-400 mt-2">⏱ {plan.duration}</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-earth-300 group-hover:text-sage-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
