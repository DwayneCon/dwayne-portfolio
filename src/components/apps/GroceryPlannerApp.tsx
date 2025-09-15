import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ShoppingCart, 
  User, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCw,
  Calendar,
  DollarSign,
  Clock,
  ChefHat,
  Star
} from 'lucide-react';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
  dietaryTags: string[];
  cost: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
}

interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  cuisinePreferences: string[];
  budgetRange: [number, number];
  householdSize: number;
  cookingSkill: 'Beginner' | 'Intermediate' | 'Advanced';
  mealTypes: string[];
}

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  estimated_price: number;
  priority: 'High' | 'Medium' | 'Low';
  checked: boolean;
}

const GroceryPlannerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'meals' | 'shopping' | 'profile'>('planner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Sample data matching your actual application structure
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: ['Italian', 'American'],
    budgetRange: [50, 100],
    householdSize: 2,
    cookingSkill: 'Intermediate',
    mealTypes: ['breakfast', 'lunch', 'dinner']
  });

  const [weeklyMeals, setWeeklyMeals] = useState<MealPlan[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  // Sample meal database
  const sampleMeals: MealPlan[] = [
    {
      id: '1',
      name: 'Mediterranean Quinoa Bowl',
      description: 'Healthy quinoa bowl with fresh vegetables and feta cheese',
      prepTime: 25,
      calories: 450,
      ingredients: ['Quinoa', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olive oil', 'Lemon'],
      instructions: ['Cook quinoa', 'Chop vegetables', 'Mix with dressing'],
      dietaryTags: ['Vegetarian', 'Gluten-free'],
      cost: 8.50,
      difficulty: 'Easy',
      rating: 4.5
    },
    {
      id: '2', 
      name: 'Chicken Stir Fry',
      description: 'Quick and easy chicken stir fry with mixed vegetables',
      prepTime: 20,
      calories: 380,
      ingredients: ['Chicken breast', 'Bell peppers', 'Broccoli', 'Soy sauce', 'Garlic', 'Ginger'],
      instructions: ['Cut chicken', 'Stir fry vegetables', 'Add sauce'],
      dietaryTags: ['High protein', 'Low carb'],
      cost: 12.00,
      difficulty: 'Medium',
      rating: 4.2
    },
    {
      id: '3',
      name: 'Vegan Buddha Bowl',
      description: 'Nutritious plant-based bowl with tahini dressing',
      prepTime: 30,
      calories: 520,
      ingredients: ['Sweet potato', 'Chickpeas', 'Kale', 'Avocado', 'Tahini', 'Hemp seeds'],
      instructions: ['Roast sweet potato', 'Massage kale', 'Prepare dressing'],
      dietaryTags: ['Vegan', 'High fiber'],
      cost: 9.75,
      difficulty: 'Medium',
      rating: 4.7
    }
  ];

  const generateMealPlan = async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    
    const steps = [
      'Analyzing dietary preferences...',
      'Calculating nutritional requirements...',
      'Searching recipe database...',
      'Optimizing for budget constraints...',
      'Generating shopping list...',
      'Finalizing meal plan...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Generate meals based on preferences
    const selectedMeals = sampleMeals
      .filter(meal => {
        if (userPreferences.dietaryRestrictions.includes('vegetarian')) {
          return meal.dietaryTags.includes('Vegetarian') || meal.dietaryTags.includes('Vegan');
        }
        return true;
      })
      .slice(0, 7);
    
    setWeeklyMeals(selectedMeals);
    
    // Generate shopping list
    const ingredients = selectedMeals.flatMap(meal => meal.ingredients);
    const uniqueIngredients = [...new Set(ingredients)];
    
    const newShoppingList: ShoppingListItem[] = uniqueIngredients.map((ingredient, index) => ({
      id: index.toString(),
      name: ingredient,
      quantity: '1 unit',
      category: getCategoryForIngredient(ingredient),
      estimated_price: Math.random() * 5 + 1,
      priority: 'Medium',
      checked: false
    }));
    
    setShoppingList(newShoppingList);
    setIsGenerating(false);
    setActiveTab('meals');
  };

  const getCategoryForIngredient = (ingredient: string): string => {
    const categories: { [key: string]: string } = {
      'Quinoa': 'Grains',
      'Chicken breast': 'Meat',
      'Cherry tomatoes': 'Produce',
      'Cucumber': 'Produce',
      'Feta cheese': 'Dairy',
      'Olive oil': 'Pantry',
      'Sweet potato': 'Produce',
      'Chickpeas': 'Pantry',
      'Kale': 'Produce',
      'Avocado': 'Produce'
    };
    return categories[ingredient] || 'Other';
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const saveMealPlan = () => {
    const newPlan = {
      id: Date.now().toString(),
      name: `Meal Plan ${new Date().toLocaleDateString()}`,
      meals: weeklyMeals,
      created: new Date().toISOString(),
      totalCost: weeklyMeals.reduce((sum, meal) => sum + meal.cost, 0)
    };
    setSavedPlans(prev => [...prev, newPlan]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-900 via-emerald-800 to-teal-800 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Grocery Planner
          </h1>
          <p className="text-gray-400 text-sm">Intelligent meal planning assistant</p>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <nav className="p-2">
            {[
              { id: 'planner', label: 'AI Planner', icon: Brain },
              { id: 'meals', label: 'Meal Plans', icon: ChefHat },
              { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
              { id: 'profile', label: 'Preferences', icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  activeTab === id
                    ? 'bg-green-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">This Week's Meals:</span>
              <span className="text-green-400">{weeklyMeals.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Total Cost:</span>
              <span className="text-green-400">
                ${weeklyMeals.reduce((sum, meal) => sum + meal.cost, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shopping Items:</span>
              <span className="text-green-400">{shoppingList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* AI Planner Tab */}
        {activeTab === 'planner' && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">AI-Powered Meal Planning</h2>
                <p className="text-gray-300 text-lg">
                  Generate personalized meal plans based on your preferences, dietary needs, and budget
                </p>
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                  >
                    <Brain size={48} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">AI is working...</h3>
                  <p className="text-gray-400 mb-6">
                    {['Analyzing dietary preferences...', 'Calculating nutritional requirements...', 'Searching recipe database...', 'Optimizing for budget constraints...', 'Generating shopping list...', 'Finalizing meal plan...'][currentStep]}
                  </p>
                  <div className="w-64 mx-auto bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((currentStep + 1) / 6) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Preferences Summary */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Your Preferences</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <User size={16} />
                        Household Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">People:</span>
                          <span>{userPreferences.householdSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cooking Level:</span>
                          <span>{userPreferences.cookingSkill}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Budget Range:</span>
                          <span>${userPreferences.budgetRange[0]} - ${userPreferences.budgetRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <ChefHat size={16} />
                        Dietary Preferences
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400 text-sm">Cuisine Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userPreferences.cuisinePreferences.map(cuisine => (
                              <span key={cuisine} className="px-2 py-1 bg-green-700 rounded text-xs">
                                {cuisine}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Meal Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {userPreferences.mealTypes.map(type => (
                              <span key={type} className="px-2 py-1 bg-blue-700 rounded text-xs capitalize">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Generate Your Plan</h3>
                    
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                      <Brain size={48} className="mx-auto text-green-400 mb-4" />
                      <h4 className="text-lg font-semibold mb-2">AI Meal Planning</h4>
                      <p className="text-gray-400 text-sm mb-6">
                        Our AI will analyze your preferences and create a personalized meal plan with automated grocery lists
                      </p>
                      
                      <button
                        onClick={generateMealPlan}
                        disabled={isGenerating}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={16} />
                        Generate Meal Plan
                      </button>
                    </div>

                    {savedPlans.length > 0 && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Saved Plans</h4>
                        <div className="space-y-2">
                          {savedPlans.slice(-3).map(plan => (
                            <div key={plan.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                              <div>
                                <div className="font-medium text-sm">{plan.name}</div>
                                <div className="text-xs text-gray-400">${plan.totalCost.toFixed(2)}</div>
                              </div>
                              <button className="text-green-400 hover:text-green-300">
                                <Edit3 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meals Tab */}
        {activeTab === 'meals' && (
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Weekly Meal Plan</h2>
                {weeklyMeals.length > 0 && (
                  <button
                    onClick={saveMealPlan}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Plan
                  </button>
                )}
              </div>

              {weeklyMeals.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weeklyMeals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{meal.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">{meal.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{meal.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-gray-700 rounded p-2">
                          <Clock size={14} className="mx-auto mb-1 text-blue-400" />
                          <div className="text-xs text-gray-400">Time</div>
                          <div className="text-sm font-medium">{meal.prepTime}m</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <ChefHat size={14} className="mx-auto mb-1 text-green-400" />
                          <div className="text-xs text-gray-400">Calories</div>
                          <div className="text-sm font-medium">{meal.calories}</div>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <DollarSign size={14} className="mx-auto mb-1 text-yellow-400" />
                          <div className="text-xs text-gray-400">Cost</div>
                          <div className="text-sm font-medium">${meal.cost.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Dietary Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {meal.dietaryTags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-green-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs">
                        <div className="text-gray-400 mb-1">Difficulty:</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          meal.difficulty === 'Easy' ? 'bg-green-700' :
                          meal.difficulty === 'Medium' ? 'bg-yellow-700' : 'bg-red-700'
                        }`}>
                          {meal.difficulty}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Meal Plan Yet</h3>
                  <p className="text-gray-400 mb-6">Generate your first AI-powered meal plan to get started</p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Go to AI Planner
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shopping List Tab */}
        {activeTab === 'shopping' && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Smart Shopping List</h2>

              {shoppingList.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(
                    shoppingList.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, ShoppingListItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold mb-4 text-lg">{category}</h3>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded ${
                              item.checked ? 'bg-gray-700 opacity-60' : 'bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleShoppingItem(item.id)}
                                className="w-4 h-4 text-green-600"
                              />
                              <div className={item.checked ? 'line-through' : ''}>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-400">{item.quantity}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${item.estimated_price.toFixed(2)}</div>
                              <div className={`text-xs px-2 py-1 rounded ${
                                item.priority === 'High' ? 'bg-red-600' :
                                item.priority === 'Medium' ? 'bg-yellow-600' : 'bg-gray-600'
                              }`}>
                                {item.priority}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Estimated Total:</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${shoppingList.reduce((sum, item) => sum + item.estimated_price, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {shoppingList.filter(item => item.checked).length} of {shoppingList.length} items checked
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Shopping List Yet</h3>
                  <p className="text-gray-400 mb-6">Generate a meal plan to automatically create your shopping list</p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Generate Meal Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Preferences & Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Household Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Household Size</label>
                        <input
                          type="number"
                          value={userPreferences.householdSize}
                          onChange={(e) => setUserPreferences(prev => ({
                            ...prev,
                            householdSize: parseInt(e.target.value)
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Cooking Skill Level</label>
                        <select
                          value={userPreferences.cookingSkill}
                          onChange={(e) => setUserPreferences(prev => ({
                            ...prev,
                            cookingSkill: e.target.value as any
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Budget Range</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${userPreferences.budgetRange[0]}</span>
                        <span>${userPreferences.budgetRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={userPreferences.budgetRange[1]}
                        onChange={(e) => setUserPreferences(prev => ({
                          ...prev,
                          budgetRange: [prev.budgetRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Dietary Restrictions</h3>
                    <div className="space-y-2">
                      {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'].map(restriction => (
                        <label key={restriction} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={userPreferences.dietaryRestrictions.includes(restriction)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUserPreferences(prev => ({
                                  ...prev,
                                  dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
                                }));
                              } else {
                                setUserPreferences(prev => ({
                                  ...prev,
                                  dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="capitalize">{restriction}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Cuisine Preferences</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian'].map(cuisine => (
                        <label key={cuisine} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={userPreferences.cuisinePreferences.includes(cuisine)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setUserPreferences(prev => ({
                                  ...prev,
                                  cuisinePreferences: [...prev.cuisinePreferences, cuisine]
                                }));
                              } else {
                                setUserPreferences(prev => ({
                                  ...prev,
                                  cuisinePreferences: prev.cuisinePreferences.filter(c => c !== cuisine)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-sm">{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryPlannerApp;