import React, { useState } from 'react';
import { 
  RefreshCw, 
  Lightbulb, 
  Copy, 
  Heart,
  Star,
  Bookmark
} from 'lucide-react';

interface Idea {
  id: string;
  text: string;
  category: string;
  liked: boolean;
  starred: boolean;
  bookmarked: boolean;
}

const WRITING_PROMPTS = [
  "Write about a character who discovers they can hear the thoughts of objects around them.",
  "A world where colors have run out and everything is grayscale - except for one person who still sees in color.",
  "Someone finds a letter addressed to them from 10 years in the future.",
  "A library where the books change their stories based on who's reading them.",
  "Write about the last person on Earth who doesn't have superpowers.",
  "A city where it's always 3 AM and the sun never rises.",
  "Someone who collects forgotten memories and stores them in jars.",
  "A character who can only speak in questions for an entire day.",
  "Write about a place where gravity works backwards every Tuesday.",
  "A world where lying causes physical pain to the liar."
];

const BUSINESS_IDEAS = [
  "An app that helps people find and trade skills with others in their community.",
  "A service that creates personalized workout plans based on your daily schedule and available equipment.",
  "A platform connecting travelers with locals who can provide authentic cultural experiences.",
  "An AI-powered meal planning service that considers dietary restrictions, budget, and food waste reduction.",
  "A subscription box for learning new hobbies with monthly projects and tutorials.",
  "A virtual interior design service using AR to help people visualize changes to their space.",
  "A platform for seniors to share their skills and stories with younger generations.",
  "An app that gamifies household chores for families with kids.",
  "A service that helps small businesses create professional video content using AI.",
  "A marketplace for renting specialized tools and equipment in your neighborhood."
];

const PROJECT_IDEAS = [
  "Build a personal finance tracker with spending insights and goal setting.",
  "Create a habit tracking app with mood correlation analysis.",
  "Develop a local event discovery platform for your city.",
  "Build a collaborative playlist maker for group music sessions.",
  "Create a recipe manager with meal planning and shopping list features.",
  "Develop a plant care reminder app with growth tracking.",
  "Build a language learning companion with conversation practice.",
  "Create a workout routine builder with progress tracking.",
  "Develop a book recommendation engine based on reading history.",
  "Build a time tracking tool with productivity insights."
];

const ART_PROMPTS = [
  "Create a piece inspired by the concept of 'digital nature' - where technology and organic forms merge.",
  "Design a character who is made entirely of geometric shapes but expresses deep emotion.",
  "Illustrate what music would look like if you could see sound waves as living creatures.",
  "Create an artwork showing a cityscape from the perspective of a cloud.",
  "Design a series of portraits where each person is represented by their favorite object.",
  "Illustrate the concept of time as a physical landscape you can walk through.",
  "Create art showing what happens in the space between two musical notes.",
  "Design a world where gravity affects colors instead of objects.",
  "Illustrate emotions as weather patterns in a surreal landscape.",
  "Create artwork showing the lifecycle of a digital memory."
];

const CATEGORIES = {
  writing: { name: 'Writing', prompts: WRITING_PROMPTS, color: 'purple' },
  business: { name: 'Business', prompts: BUSINESS_IDEAS, color: 'blue' },
  project: { name: 'Project', prompts: PROJECT_IDEAS, color: 'green' },
  art: { name: 'Art', prompts: ART_PROMPTS, color: 'orange' }
};

const IdeaGenerator: React.FC = () => {
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('writing');
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateIdea = () => {
    const category = CATEGORIES[selectedCategory];
    const randomPrompt = category.prompts[Math.floor(Math.random() * category.prompts.length)];
    
    const newIdea: Idea = {
      id: Date.now().toString(),
      text: randomPrompt,
      category: category.name,
      liked: false,
      starred: false,
      bookmarked: false
    };
    
    setCurrentIdea(newIdea);
  };

  const saveIdea = (action: 'like' | 'star' | 'bookmark') => {
    if (!currentIdea) return;
    
    const updatedIdea = { ...currentIdea, [action === 'like' ? 'liked' : action === 'star' ? 'starred' : 'bookmarked']: true };
    
    setSavedIdeas(prev => {
      const existing = prev.find(idea => idea.id === updatedIdea.id);
      if (existing) {
        return prev.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea);
      } else {
        return [...prev, updatedIdea];
      }
    });
    
    setCurrentIdea(updatedIdea);
  };

  const copyIdea = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  React.useEffect(() => {
    generateIdea();
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="flex flex-wrap gap-3 p-4 bg-slate-700/50 rounded-xl">
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as keyof typeof CATEGORIES)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === key
                ? `bg-${category.color}-600 text-white`
                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Current Idea */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-bold text-white">
              {currentIdea ? CATEGORIES[selectedCategory].name : 'Generate'} Idea
            </h2>
          </div>
          
          <button
            onClick={generateIdea}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            New Idea
          </button>
        </div>

        {currentIdea && (
          <div className="space-y-4">
            <p className="text-lg text-slate-200 leading-relaxed">
              {currentIdea.text}
            </p>
            
            <div className="flex items-center justify-between">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-${CATEGORIES[selectedCategory].color}-600/20 text-${CATEGORIES[selectedCategory].color}-400`}>
                {currentIdea.category}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => saveIdea('like')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentIdea.liked
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                  title="Like"
                >
                  <Heart size={18} />
                </button>
                
                <button
                  onClick={() => saveIdea('star')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentIdea.starred
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                  title="Star"
                >
                  <Star size={18} />
                </button>
                
                <button
                  onClick={() => saveIdea('bookmark')}
                  className={`p-2 rounded-lg transition-colors ${
                    currentIdea.bookmarked
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark size={18} />
                </button>
                
                <button
                  onClick={() => copyIdea(currentIdea.text, currentIdea.id)}
                  className="p-2 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-lg transition-colors"
                  title="Copy"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Ideas */}
      {savedIdeas.length > 0 && (
        <div className="bg-slate-700/30 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Saved Ideas</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {savedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-600"
              >
                <p className="text-slate-200 text-sm mb-2">{idea.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{idea.category}</span>
                  <div className="flex gap-1">
                    {idea.liked && <Heart size={14} className="text-red-400" />}
                    {idea.starred && <Star size={14} className="text-yellow-400" />}
                    {idea.bookmarked && <Bookmark size={14} className="text-blue-400" />}
                    <button
                      onClick={() => copyIdea(idea.text, idea.id)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-slate-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Creative Tips:</h3>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Don't judge ideas immediately - let them simmer and develop</li>
          <li>• Combine ideas from different categories for unique concepts</li>
          <li>• Save ideas that resonate with you, even if you can't use them now</li>
          <li>• Use prompts as starting points - feel free to modify and expand them</li>
        </ul>
      </div>
    </div>
  );
};

export default IdeaGenerator;