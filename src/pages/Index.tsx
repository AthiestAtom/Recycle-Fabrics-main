



import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Recycle, Camera, Globe, ArrowDown, Leaf, Sparkles, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import ImageUploader from "@/components/features/ImageUploader";
import ClassificationResult, { type FabricResult } from "@/components/features/ClassificationResult";
import AnalyzingState from "@/components/features/AnalyzingState";
import VideoBackground from "@/components/common/VideoBackground";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FabricResult | null>(null);
  
  // Blog content state
  const [selectedBlogPost, setSelectedBlogPost] = useState<string | null>(null);
  
  // New states for functional features
  const [fabricQuantities, setFabricQuantities] = useState<{[key: string]: number}>({});
  const [pickupForm, setPickupForm] = useState({
    address: '',
    date: '',
    time: '',
    amount: '',
    instructions: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [bids, setBids] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  
  // Materials data with detailed information
  const materialsData = [
    { 
      name: 'Cotton', 
      icon: '🌱', 
      recyclable: true, 
      biodegradable: true, 
      impact: 'Moderate',
      description: 'Natural fiber from cotton plants, breathable and comfortable.',
      uses: 'T-shirts, jeans, dresses, underwear',
      care: 'Machine wash warm, tumble dry medium',
      recycling: 'Can be recycled into insulation, cleaning rags, or new cotton fibers'
    },
    { 
      name: 'Denim', 
      icon: '👖', 
      recyclable: true, 
      biodegradable: true, 
      impact: 'High',
      description: 'Sturdy cotton twill fabric, known for durability.',
      uses: 'Jeans, jackets, bags, upholstery',
      care: 'Wash inside out, cold water, air dry when possible',
      recycling: 'Can be recycled into denim insulation, new denim products, or cotton fiber'
    },
    { 
      name: 'Polyester', 
      icon: '🏭', 
      recyclable: true, 
      biodegradable: false, 
      impact: 'High',
      description: 'Synthetic fiber made from petroleum, durable and wrinkle-resistant.',
      uses: 'Sportswear, fleece jackets, bedding, upholstery',
      care: 'Machine wash cold, low heat drying',
      recycling: 'Can be recycled into polyester pellets for new fabrics or products'
    },
    { 
      name: 'Silk', 
      icon: '🎭', 
      recyclable: false, 
      biodegradable: true, 
      impact: 'Low',
      description: 'Natural protein fiber from silkworms, luxurious and smooth.',
      uses: 'Scarves, blouses, lingerie, dresses',
      care: 'Dry clean or hand wash cold, air dry',
      recycling: 'Best repurposed or donated due to high value'
    },
    { 
      name: 'Wool', 
      icon: '🐑', 
      recyclable: true, 
      biodegradable: true, 
      impact: 'Moderate',
      description: 'Natural fiber from sheep, warm and moisture-wicking.',
      uses: 'Sweaters, coats, blankets, socks',
      care: 'Hand wash cold, lay flat to dry',
      recycling: 'Can be recycled into wool insulation, felt, or new wool products'
    },
    { 
      name: 'Leather', 
      icon: '👜', 
      recyclable: false, 
      biodegradable: true, 
      impact: 'High',
      description: 'Animal hide, durable and flexible material.',
      uses: 'Shoes, bags, jackets, furniture',
      care: 'Professional cleaning, condition regularly',
      recycling: 'Best repurposed or upcycled into new leather goods'
    },
    { 
      name: 'Nylon', 
      icon: '🧦', 
      recyclable: true, 
      biodegradable: false, 
      impact: 'High',
      description: 'Synthetic polymer, strong and elastic.',
      uses: 'Stockings, swimwear, ropes, carpets',
      care: 'Machine wash cold, avoid high heat',
      recycling: 'Can be recycled into nylon pellets for new products'
    },
    { 
      name: 'Linen', 
      icon: '☘️', 
      recyclable: true, 
      biodegradable: true, 
      impact: 'Low',
      description: 'Natural fiber from flax plants, strong and breathable.',
      uses: 'Summer clothing, tablecloths, bedding',
      care: 'Machine wash cold, air dry, iron while damp',
      recycling: 'Can be recycled into linen paper, insulation, or new linen products'
    },
    { 
      name: 'Mixed/Blended', 
      icon: '🎨', 
      recyclable: false, 
      biodegradable: false, 
      impact: 'Varies',
      description: 'Combination of different fibers, properties vary.',
      uses: 'Various clothing and household items',
      care: 'Follow care label instructions',
      recycling: 'Difficult to recycle, best repurposed or downcycled'
    }
  ];
  const blogPosts = [
    {
      id: 'fast-fashion',
      title: "The Hidden Environmental Cost of Fast Fashion",
      category: "Sustainability",
      readTime: "5 min read",
      content: `The fast fashion industry has a devastating impact on our environment that goes far beyond what most consumers realize. Every year, the fashion industry produces over 100 billion garments, with nearly 60% ending up in landfills within a year of production.

The water consumption alone is staggering - it takes approximately 2,700 liters of water to produce a single cotton t-shirt, equivalent to what one person drinks over 900 days. The industry is also responsible for 10% of global carbon emissions, more than all international flights and maritime shipping combined.

Microplastic pollution from synthetic fabrics is another critical issue. When we wash clothes made from polyester, nylon, or acrylic, they release hundreds of thousands of tiny plastic fibers into our water systems, eventually making their way into our oceans and food chain.

The solution starts with conscious consumerism. By choosing quality over quantity, supporting sustainable brands, and properly caring for our clothes to extend their lifespan, we can significantly reduce our fashion footprint. Small changes like washing clothes in cold water, air-drying instead of using machines, and donating unwanted items can make a substantial difference.

The future of fashion lies in circular economy models, where materials are reused, recycled, and regenerated. Brands are increasingly adopting innovative approaches like clothing rental services, take-back programs, and using recycled materials to create new garments.`,
      fullContent: `The fast fashion industry has a devastating impact on our environment that goes far beyond what most consumers realize. Every year, the fashion industry produces over 100 billion garments, with nearly 60% ending up in landfills within a year of production.

The water consumption alone is staggering - it takes approximately 2,700 liters of water to produce a single cotton t-shirt, equivalent to what one person drinks over 900 days. The industry is also responsible for 10% of global carbon emissions, more than all international flights and maritime shipping combined.

Microplastic pollution from synthetic fabrics is another critical issue. When we wash clothes made from polyester, nylon, or acrylic, they release hundreds of thousands of tiny plastic fibers into our water systems, eventually making their way into our oceans and food chain.

The solution starts with conscious consumerism. By choosing quality over quantity, supporting sustainable brands, and properly caring for our clothes to extend their lifespan, we can significantly reduce our fashion footprint. Small changes like washing clothes in cold water, air-drying instead of using machines, and donating unwanted items can make a substantial difference.

The future of fashion lies in circular economy models, where materials are reused, recycled, and regenerated. Brands are increasingly adopting innovative approaches like clothing rental services, take-back programs, and using recycled materials to create new garments.

As consumers, we have the power to drive change through our purchasing decisions. Supporting brands that prioritize sustainability, buying second-hand, and learning basic repair skills can help transform the industry. The environmental cost of fast fashion is high, but together, we can create a more sustainable future for fashion.`
    },
    {
      id: 'textile-recycling',
      title: "Textile Recycling: A Complete Guide",
      category: "Recycling",
      readTime: "7 min read",
      content: `Textile recycling is one of the most effective ways to reduce the environmental impact of the fashion industry, yet only about 15% of textiles are currently recycled worldwide. Understanding the recycling process can help you make better decisions about your unwanted clothes and fabrics.

Different materials require different recycling approaches. Natural fibers like cotton, wool, and silk can be mechanically recycled into new yarns or insulation materials. Synthetic fibers such as polyester and nylon can be chemically recycled back into their raw materials and used to create new fabrics.

Before recycling, it's important to prepare your textiles properly. Clean all items thoroughly, remove any non-textile components like zippers or buttons, and sort materials by fiber type. Many recycling centers have specific requirements, so check with your local facility first.

There are several ways to recycle textiles: through dedicated recycling centers, donation centers, brand take-back programs, or community textile drives. Many major retailers now offer in-store recycling programs where you can drop off unwanted clothing regardless of brand.

The benefits of textile recycling extend beyond environmental protection. Recycled textiles can create new jobs, reduce the need for virgin materials, and even generate economic value from waste. Some recycled materials are used to create innovative products like insulation, cleaning rags, or even new clothing items.

By participating in textile recycling, you're contributing to a circular economy where waste becomes a resource. This not only helps the environment but also supports the growing sustainable fashion industry.`,
      fullContent: `Textile recycling is one of the most effective ways to reduce the environmental impact of the fashion industry, yet only about 15% of textiles are currently recycled worldwide. Understanding the recycling process can help you make better decisions about your unwanted clothes and fabrics.

Different materials require different recycling approaches. Natural fibers like cotton, wool, and silk can be mechanically recycled into new yarns or insulation materials. Synthetic fibers such as polyester and nylon can be chemically recycled back into their raw materials and used to create new fabrics.

Before recycling, it's important to prepare your textiles properly. Clean all items thoroughly, remove any non-textile components like zippers or buttons, and sort materials by fiber type. Many recycling centers have specific requirements, so check with your local facility first.

There are several ways to recycle textiles: through dedicated recycling centers, donation centers, brand take-back programs, or community textile drives. Many major retailers now offer in-store recycling programs where you can drop off unwanted clothing regardless of brand.

The benefits of textile recycling extend beyond environmental protection. Recycled textiles can create new jobs, reduce the need for virgin materials, and even generate economic value from waste. Some recycled materials are used to create innovative products like insulation, cleaning rags, or even new clothing items.

By participating in textile recycling, you're contributing to a circular economy where waste becomes a resource. This not only helps the environment but also supports the growing sustainable fashion industry.

The future of textile recycling looks promising with new technologies emerging that can handle blended fabrics and complex materials. Innovations in chemical recycling are making it possible to recover high-quality fibers from old clothes, opening up new possibilities for a truly circular fashion economy.`
    },
    {
      id: 'sustainable-wardrobe',
      title: "Building a Sustainable Wardrobe",
      category: "Fashion",
      readTime: "6 min read",
      content: `Creating a sustainable wardrobe doesn't mean sacrificing style or breaking the bank. It's about making conscious choices that benefit both the environment and your wallet in the long run. The key is to focus on quality, versatility, and timeless design.

Start by assessing your current wardrobe. Take everything out and categorize items into keep, donate, and recycle piles. Be honest about what you actually wear and what fits your lifestyle. This process helps you identify gaps and avoid unnecessary future purchases.

When shopping new, prioritize quality over quantity. Look for well-made garments from sustainable materials like organic cotton, linen, hemp, or recycled fabrics. Check for certifications like GOTS (Global Organic Textile Standard) or Fair Trade to ensure ethical production.

Second-hand shopping is another excellent strategy for building a sustainable wardrobe. Thrift stores, consignment shops, and online platforms offer a wide selection of pre-loved clothing at a fraction of the cost. This not only saves money but also extends the life of existing garments.

Learn basic repair skills to extend the life of your clothes. Simple tasks like sewing on a button, fixing a small tear, or hemming pants can save clothes from ending up in landfills. Many communities offer repair workshops or online tutorials to help you get started.

Finally, embrace the concept of a capsule wardrobe - a curated collection of versatile pieces that can be mixed and matched to create numerous outfits. This approach reduces the need for excessive clothing while ensuring you always have something appropriate to wear.`,
      fullContent: `Creating a sustainable wardrobe doesn't mean sacrificing style or breaking the bank. It's about making conscious choices that benefit both the environment and your wallet in the long run. The key is to focus on quality, versatility, and timeless design.

Start by assessing your current wardrobe. Take everything out and categorize items into keep, donate, and recycle piles. Be honest about what you actually wear and what fits your lifestyle. This process helps you identify gaps and avoid unnecessary future purchases.

When shopping new, prioritize quality over quantity. Look for well-made garments from sustainable materials like organic cotton, linen, hemp, or recycled fabrics. Check for certifications like GOTS (Global Organic Textile Standard) or Fair Trade to ensure ethical production.

Second-hand shopping is another excellent strategy for building a sustainable wardrobe. Thrift stores, consignment shops, and online platforms offer a wide selection of pre-loved clothing at a fraction of the cost. This not only saves money but also extends the life of existing garments.

Learn basic repair skills to extend the life of your clothes. Simple tasks like sewing on a button, fixing a small tear, or hemming pants can save clothes from ending up in landfills. Many communities offer repair workshops or online tutorials to help you get started.

Finally, embrace the concept of a capsule wardrobe - a curated collection of versatile pieces that can be mixed and matched to create numerous outfits. This approach reduces the need for excessive clothing while ensuring you always have something appropriate to wear.

Remember that building a sustainable wardrobe is a journey, not a destination. Start small, make gradual changes, and celebrate your progress along the way. Every sustainable choice you make contributes to a larger positive impact on the fashion industry and our planet.`
    }
  ];

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedImage(preview);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
  }, []);

  // Price calculator functionality
  const fabricPrices = {
    'Cotton': 3.50,
    'Denim': 4.50,
    'Polyester': 2.00,
    'Wool': 6.00,
    'Silk': 8.00,
    'Linen': 5.50
  };

  const handleQuantityChange = (material: string, quantity: number) => {
    setFabricQuantities(prev => ({
      ...prev,
      [material]: quantity || 0
    }));
  };

  const calculateTotalValue = () => {
    return Object.entries(fabricQuantities).reduce((total, [material, quantity]) => {
      return total + (quantity * fabricPrices[material as keyof typeof fabricPrices] || 0);
    }, 0);
  };

  const calculateTotalWeight = () => {
    return Object.values(fabricQuantities).reduce((total, quantity) => total + quantity, 0);
  };

  // Pickup form handlers
  const handlePickupFormChange = (field: string, value: string) => {
    setPickupForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePickupSubmit = () => {
    if (!pickupForm.address || !pickupForm.date || !pickupForm.time || !pickupForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Pickup scheduled successfully! We\'ll contact you soon.');
    setPickupForm({
      address: '',
      date: '',
      time: '',
      amount: '',
      instructions: ''
    });
  };

  // Marketplace functionality
  const handleBid = (itemId: string, currentPrice: number) => {
    const newBid = currentPrice + 1;
    setBids(prev => ({
      ...prev,
      [itemId]: newBid
    }));
    toast.success(`Bid placed: $${newBid}`);
  };

  // Search functionality - Chandigarh specific routes
  const filteredRoutes = [
    { area: "Sector 17", schedule: "Mon, Wed, Fri", nextPickup: "Tomorrow 10AM", status: "Active" },
    { area: "Sector 22", schedule: "Tue, Thu", nextPickup: "Today 2PM", status: "Active" },
    { area: "Sector 35", schedule: "Mon, Thu", nextPickup: "Tomorrow 3PM", status: "Active" },
    { area: "Sector 43", schedule: "Wed, Sat", nextPickup: "Wednesday 11AM", status: "Active" },
    { area: "Sector 15", schedule: "Tue, Fri", nextPickup: "Friday 9AM", status: "Active" },
    { area: "Sector 19", schedule: "Mon, Wed, Fri", nextPickup: "Monday 4PM", status: "Active" },
    { area: "Sector 27", schedule: "Tue, Thu", nextPickup: "Thursday 11AM", status: "Active" },
    { area: "Sector 8", schedule: "Mon, Fri", nextPickup: "Friday 2PM", status: "Active" },
    { area: "Sector 21", schedule: "Wed, Sat", nextPickup: "Saturday 10AM", status: "Active" },
    { area: "Sector 44", schedule: "Tue, Fri", nextPickup: "Tuesday 3PM", status: "Active" }
  ].filter(route => 
    route.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = async () => {
    console.log('=== ANALYZE BUTTON CLICKED ===');
    console.log('Selected image:', selectedImage);
    console.log('Selected file:', selectedFile);
    console.log('Selected file exists:', !!selectedFile);
    console.log('Selected file type:', selectedFile?.type);
    console.log('Selected file size:', selectedFile?.size);
    
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }
    
    if (!selectedFile) {
      toast.error('No file selected - please try selecting the image again');
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call backend API with cache-busting
      const apiUrl = '/api/classify-fabric?t=' + Date.now();
      
      console.log('=== SENDING REQUEST ===');
      console.log('API URL:', apiUrl);
      console.log('Selected file:', selectedFile);
      console.log('Selected file type:', selectedFile?.type);
      console.log('Selected file size:', selectedFile?.size);
      console.log('FormData entries:', [...formData.entries()]);
      console.log('FormData has image:', formData.has('image'));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('=== RESPONSE RECEIVED ===');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('=== SUCCESS DATA ===');
      console.log('Raw data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', Object.keys(data));
      
      // Check the structure of the response
      if (data.success && data.result) {
        console.log('Setting result:', data.result);
        setResult(data.result);
      } else if (data.material) {
        console.log('Setting result directly:', data);
        setResult(data);
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error("=== CLASSIFICATION ERROR ===");
      console.error("Error:", err);
      console.error("Error message:", err.message);
      toast.error(err.message || "Failed to classify fabric. Please try again.");
    } finally {
      console.log('=== ANALYSIS COMPLETE ===');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative z-10">
        {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-32 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-3000" />
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold mb-8 shadow-2xl">
              <Leaf className="w-6 h-6" />
              AI-Powered Textile Classification
              <Sparkles className="w-6 h-6" />
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8 drop-shadow-2xl">
              Chandigarh's Fabric
              <br />
              <span className="text-5xl sm:text-6xl lg:text-7xl text-emerald-100">Recycling Revolution</span>
            </h1>

            <p className="text-2xl text-white/95 mt-8 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              Serving all sectors of Chandigarh. Upload a photo of any textile or fabric waste. 
              Our AI identifies material and tells you exactly how to recycle or repurpose it responsibly.
            </p>

            <div className="flex items-center justify-center gap-12 mt-16">
              <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/25 backdrop-blur-md border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300">
                <div className="p-3 rounded-2xl bg-emerald-400 shadow-lg">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">9 Material Types</div>
                  <div className="text-emerald-100 text-sm">Accurate detection</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/25 backdrop-blur-md border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300">
                <div className="p-3 rounded-2xl bg-teal-400 shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">AI Vision</div>
                  <div className="text-emerald-100 text-sm">Smart analysis</div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/25 backdrop-blur-md border border-white/30 shadow-2xl hover:bg-white/30 transition-all duration-300">
                <div className="p-3 rounded-2xl bg-cyan-400 shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">Eco Impact</div>
                  <div className="text-emerald-100 text-sm">Track footprint</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  const classifySection = document.getElementById('classify');
                  if (classifySection) {
                    classifySection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 1000, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-4 mt-20 px-12 py-6 bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-xl hover:from-emerald-300 hover:to-teal-300"
              >
                Try it now
                <ArrowDown className="w-6 h-6 animate-bounce" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Why Choose FabricSort?
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Our AI-powered platform makes textile recycling simple, accurate, and impactful
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">AI Vision Analysis</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Advanced computer vision identifies fabric types with 95%+ accuracy. Simply snap a photo and get instant results.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Real-time material detection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Multiple fabric support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Instant results
                  </li>
                </ul>
              </div>

              <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Smart Recycling Guide</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get personalized recycling instructions based on your local facilities and material type.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Location-based guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Step-by-step instructions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Facility finder
                  </li>
                </ul>
              </div>

              <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Environmental Impact</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Track your positive environmental contribution and learn about sustainable fashion choices.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Carbon footprint tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Impact analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Sustainability tips
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Making a Real Impact
              </h2>
              <p className="text-xl text-white/80 font-light max-w-3xl mx-auto">
                Join thousands of users making sustainable textile choices
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80 font-medium">Fabrics Analyzed</div>
                <div className="text-white/60 text-sm mt-1">And counting daily</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-white/80 font-medium">Accuracy Rate</div>
                <div className="text-white/60 text-sm mt-1">AI-powered precision</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">2.5M</div>
                <div className="text-white/80 font-medium">kg CO₂ Saved</div>
                <div className="text-white/60 text-sm mt-1">Environmental impact</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">150+</div>
                <div className="text-white/80 font-medium">Cities Covered</div>
                <div className="text-white/60 text-sm mt-1">Global reach</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Guide Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Materials We Recognize
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Our AI is trained to identify all common textile materials with detailed recycling guidance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialsData.map((material, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{material.icon}</div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-gray-800">{material.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {material.recyclable && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            Recyclable
                          </span>
                        )}
                        {material.biodegradable && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Biodegradable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">Environmental Impact:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        material.impact === 'Low' ? 'bg-green-100 text-green-700' :
                        material.impact === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        material.impact === 'High' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {material.impact}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Common Uses:</span> {material.uses}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Care:</span> {material.care}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Recycling:</span> {material.recycling}
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success(`Detailed guide for ${material.name} coming soon!`)}
                    className="mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  >
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Care Guide Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Fabric Care & Maintenance Guide
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Extend the life of your textiles with proper care techniques and sustainable practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💧</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Washing Best Practices</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span>Wash in cold water to save energy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span>Use eco-friendly detergents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span>Wash full loads to maximize efficiency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span>Avoid fabric softeners for natural fibers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Stain Removal Tips</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <span>Act quickly - fresh stains are easier</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <span>Use natural solutions like vinegar or baking soda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <span>Avoid harsh chemicals on delicate fabrics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                    <span>Test solutions on hidden areas first</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">☀️</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Drying & Storage</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>Air dry when possible to save energy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>Store in cool, dry places</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>Use cedar blocks instead of mothballs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span>Rotate seasonal items regularly</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 border border-purple-200">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">Quick Care Reference</h3>
                <div className="grid md:grid-cols-4 gap-6 text-left">
                  <div className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-purple-700 mb-2">👕 Cotton</div>
                    <div className="text-sm text-gray-600">Machine wash cold, tumble dry low</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-blue-700 mb-2">👖 Denim</div>
                    <div className="text-sm text-gray-600">Wash inside out, air dry recommended</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-green-700 mb-2">🧦 Wool</div>
                    <div className="text-sm text-gray-600">Hand wash cold, lay flat to dry</div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="font-semibold text-pink-700 mb-2">🎭 Silk</div>
                    <div className="text-sm text-gray-600">Dry clean only or hand wash gently</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Calculator */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Calculate Your Environmental Impact
            </h2>
            <p className="text-xl text-white/80 font-light mb-8">
              See how your textile choices affect the planet
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👕</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">2,700L</div>
                  <div className="text-white/80 font-medium">Water Saved</div>
                  <div className="text-white/60 text-sm mt-1">Per recycled cotton shirt</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">7kg</div>
                  <div className="text-white/80 font-medium">CO₂ Reduced</div>
                  <div className="text-white/60 text-sm mt-1">Per kg of recycled polyester</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">70%</div>
                  <div className="text-white/80 font-medium">Energy Saved</div>
                  <div className="text-white/60 text-sm mt-1">Using recycled vs virgin materials</div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  Calculate Your Impact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Locator Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Find Recycling Facilities Near You
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Locate the nearest textile recycling centers and drop-off points in your area
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100">
                <h3 className="font-display text-2xl font-bold text-gray-800 mb-6">Popular Recycling Locations</h3>
                <div className="space-y-4">
                  {[
                    { name: "Green Earth Recycling", distance: "0.8 mi", type: "Textiles Only", rating: 4.8 },
                    { name: "City Waste Management", distance: "1.2 mi", type: "Multi-Material", rating: 4.5 },
                    { name: "EcoPoint Collection Center", distance: "2.1 mi", type: "Textiles & Electronics", rating: 4.9 },
                    { name: "Community Recycling Hub", distance: "3.5 mi", type: "All Materials", rating: 4.6 }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-100 to-emerald-100 flex items-center justify-center">
                          <Recycle className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{location.name}</div>
                          <div className="text-sm text-gray-600">{location.type} • {location.distance}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <span>⭐</span>
                          <span className="font-medium">{location.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl p-8 shadow-xl text-white">
                <h3 className="font-display text-2xl font-bold mb-6">Find Your Nearest Center</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter your ZIP code or address"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:border-white/50"
                  />
                  <select className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:border-white/50">
                    <option value="" className="text-gray-800">Select material type</option>
                    <option value="all" className="text-gray-800">All Materials</option>
                    <option value="textiles" className="text-gray-800">Textiles Only</option>
                    <option value="electronics" className="text-gray-800">Electronics</option>
                  </select>
                  <button className="w-full px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                    Search Locations
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Did you know?</span>
                  </div>
                  <p className="text-sm text-white/80">
                    Over 75% of textiles can be recycled, yet only 15% actually are. Find your local center and make a difference!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classifier Section */}
      <section id="classify" className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Classify Your Textile
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Take a clear photo of the fabric — the closer, the better
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            <div className="space-y-8">
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClear}
                isAnalyzing={isAnalyzing}
              />

              {selectedImage && !isAnalyzing && !result && (
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="w-full font-display font-semibold text-lg gap-3 py-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
                >
                  <Sparkles className="w-6 h-6" />
                  Identify Material
                </Button>
              )}

              {isAnalyzing && <AnalyzingState />}

              {result && <ClassificationResult result={result} />}

              {result && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="lg"
                  className="w-full font-display text-lg py-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-2xl"
                >
                  Classify Another Fabric
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Blog Section */}
      <section className="py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Learn & Explore
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Discover the latest insights on sustainable fashion and textile recycling
              </p>
            </div>

            {selectedBlogPost ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
                <button 
                  onClick={() => setSelectedBlogPost(null)}
                  className="mb-6 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-2"
                >
                  ← Back to Blog
                </button>
                <article>
                  {(() => {
                    const post = blogPosts.find(p => p.id === selectedBlogPost);
                    if (!post) return null;
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">{post.readTime}</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-6">
                          {post.title}
                        </h1>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                          {post.fullContent.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </article>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-8">
                  {blogPosts.map((post, index) => (
                    <article key={post.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className={`h-48 bg-gradient-to-r ${
                        index === 0 ? 'from-emerald-400 to-teal-400' :
                        index === 1 ? 'from-blue-400 to-purple-400' :
                        'from-purple-400 to-pink-400'
                      } relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl">{index === 0 ? '🌍' : index === 1 ? '♻️' : '👗'}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            index === 0 ? 'bg-emerald-100 text-emerald-700' :
                            index === 1 ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">{post.readTime}</span>
                        </div>
                        <h3 className={`font-display text-xl font-bold text-gray-800 mb-3 group-hover:${
                          index === 0 ? 'text-emerald-600' :
                          index === 1 ? 'text-blue-600' :
                          'text-purple-600'
                        } transition-colors`}>
                          {post.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <button 
                          onClick={() => setSelectedBlogPost(post.id)}
                          className={`font-semibold hover:${
                            index === 0 ? 'text-emerald-700' :
                            index === 1 ? 'text-blue-700' :
                            'text-purple-700'
                          } transition-colors ${
                            index === 0 ? 'text-emerald-600' :
                            index === 1 ? 'text-blue-600' :
                            'text-purple-600'
                          }`}
                        >
                          Read More →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button 
                    onClick={() => toast.success('More articles coming soon!')}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                  >
                    View All Articles
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sustainability Challenge Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold mb-6">
              <span className="text-2xl">🏆</span>
              Join the Challenge
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              30-Day Sustainability Challenge
            </h2>
            <p className="text-xl text-white/80 font-light mb-8">
              Transform your habits and make a real impact on the environment
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/80 font-medium">Participants</div>
                <div className="text-white/60 text-sm mt-1">Already making a difference</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">500K</div>
                <div className="text-white/80 font-medium">Items Recycled</div>
                <div className="text-white/60 text-sm mt-1">Through the challenge</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">100+</div>
                <div className="text-white/80 font-medium">Eco Rewards</div>
                <div className="text-white/60 text-sm mt-1">Earn sustainable prizes</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Weekly Challenges</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <div className="font-semibold text-white">Fabric Audit Week</div>
                      <div className="text-white/70 text-sm">Sort and categorize all textiles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <div className="font-semibold text-white">No-New-Clothes Week</div>
                      <div className="text-white/70 text-sm">Wear only existing wardrobe</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <div className="font-semibold text-white">Repair & Upcycle</div>
                      <div className="text-white/70 text-sm">Fix damaged items creatively</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">4</div>
                    <div>
                      <div className="font-semibold text-white">Recycling Drive</div>
                      <div className="text-white/70 text-sm">Donate 10+ items to recycle</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">5</div>
                    <div>
                      <div className="font-semibold text-white">Sustainable Swaps</div>
                      <div className="text-white/70 text-sm">Replace 5 items with eco alternatives</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">6</div>
                    <div>
                      <div className="font-semibold text-white">Community Impact</div>
                      <div className="text-white/70 text-sm">Teach others about textile recycling</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  Start Challenge Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Pickup Scheduling Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold mb-6">
                  <span className="text-2xl">🚚</span>
                  Free Pickup Service
                </div>
                <h2 className="font-display text-4xl font-bold text-white mb-6">
                  We Come to You
                </h2>
                <p className="text-xl text-white/80 font-light mb-8">
                  Schedule a convenient pickup and we'll collect your fabrics directly from your doorstep. No hassle, no cost.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Flexible Scheduling</div>
                      <div className="text-white/70 text-sm">Choose dates and times that work for you</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Doorstep Collection</div>
                      <div className="text-white/70 text-sm">We pick up from your home or office</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Instant Payment</div>
                      <div className="text-white/70 text-sm">Get paid immediately upon collection</div>
                    </div>
                  </div>
                </div>
                
                <button className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  Schedule Your Pickup
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Pickup Form</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Your Address</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full address"
                      value={pickupForm.address}
                      onChange={(e) => handlePickupFormChange('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:border-white/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Pickup Date</label>
                      <input 
                        type="date" 
                        value={pickupForm.date}
                        onChange={(e) => handlePickupFormChange('date', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Preferred Time</label>
                      <select 
                        value={pickupForm.time}
                        onChange={(e) => handlePickupFormChange('time', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="" className="text-gray-800">Select time</option>
                        <option value="morning" className="text-gray-800">Morning (9AM-12PM)</option>
                        <option value="afternoon" className="text-gray-800">Afternoon (12PM-5PM)</option>
                        <option value="evening" className="text-gray-800">Evening (5PM-8PM)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Estimated Fabric Amount</label>
                    <select 
                      value={pickupForm.amount}
                      onChange={(e) => handlePickupFormChange('amount', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:border-white/50"
                    >
                      <option value="" className="text-gray-800">Select amount</option>
                      <option value="small" className="text-gray-800">Small bag (1-5kg)</option>
                      <option value="medium" className="text-gray-800">Medium bag (5-15kg)</option>
                      <option value="large" className="text-gray-800">Large bag (15-30kg)</option>
                      <option value="bulk" className="text-gray-800">Bulk collection (30kg+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Special Instructions</label>
                    <textarea 
                      placeholder="Any special access instructions or details..."
                      rows={3}
                      value={pickupForm.instructions}
                      onChange={(e) => handlePickupFormChange('instructions', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:border-white/50"
                    />
                  </div>
                  <button 
                    onClick={handlePickupSubmit}
                    className="w-full px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
                  >
                    Book Free Pickup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Selling Portal Section */}
      <section className="py-24 bg-gradient-to-b from-teal-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                Sell Your Fabrics to Us
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                We buy all types of fabrics - new, used, damaged, or scrap. Get competitive rates and instant payment.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">92M</div>
                <div className="text-gray-600 font-medium">Tons of Textile Waste Annually</div>
                <div className="text-sm text-gray-500 mt-1">Source: Ellen MacArthur Foundation</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">♻️</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">12%</div>
                <div className="text-gray-600 font-medium">Global Textile Recycling Rate</div>
                <div className="text-sm text-gray-500 mt-1">Source: EPA 2022 Report</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💧</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">7,500L</div>
                <div className="text-gray-600 font-medium">Water for 1 T-shirt</div>
                <div className="text-sm text-gray-500 mt-1">Source: World Wildlife Fund</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">10%</div>
                <div className="text-gray-600 font-medium">Global Carbon Emissions</div>
                <div className="text-sm text-gray-500 mt-1">Source: UN Fashion Industry Charter</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-display text-2xl font-bold text-gray-800">Quick Price Calculator</h3>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Select Fabric Types</h4>
                    <div className="space-y-3">
                      {[
                        { material: 'Cotton', price: '$3.50/kg', icon: '👕' },
                        { material: 'Denim', price: '$4.50/kg', icon: '👖' },
                        { material: 'Polyester', price: '$2.00/kg', icon: '🧶' },
                        { material: 'Wool', price: '$6.00/kg', icon: '🐑' },
                        { material: 'Silk', price: '$8.00/kg', icon: '🎭' },
                        { material: 'Linen', price: '$5.50/kg', icon: '☘️' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <div className="font-medium text-gray-800">{item.material}</div>
                              <div className="text-sm text-gray-600">{item.price}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="kg" 
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                              value={fabricQuantities[item.material] || ''}
                              onChange={(e) => handleQuantityChange(item.material, parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.1"
                            />
                            <div className="text-sm font-semibold text-green-600">
                              ${((fabricQuantities[item.material] || 0) * fabricPrices[item.material as keyof typeof fabricPrices]).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Estimated Payout</h4>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">${calculateTotalValue().toFixed(2)}</div>
                        <div className="text-gray-600">Total Estimated Value</div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Weight:</span>
                          <span className="font-medium">{calculateTotalWeight().toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Average Price:</span>
                          <span className="font-medium">
                            ${calculateTotalWeight() > 0 ? (calculateTotalValue() / calculateTotalWeight()).toFixed(2) : '0.00'}/kg
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Processing Fee:</span>
                          <span className="font-medium text-red-600">-${(calculateTotalValue() * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>You'll Receive:</span>
                            <span className="text-emerald-600">${(calculateTotalValue() * 0.95).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (calculateTotalWeight() === 0) {
                            toast.error('Please add at least one fabric type');
                            return;
                          }
                          toast.success('Quote generated! Proceeding to schedule pickup...');
                        }}
                        className="w-full px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        Get Quote & Schedule Pickup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Network Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold mb-6">
                <span className="text-2xl">🤝</span>
                Our Network
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-6">
                Powered by Community Partners
              </h2>
              <p className="text-xl text-white/80 font-light max-w-3xl mx-auto">
                We work with local communities, NGOs, and recycling centers to make fabric collection accessible everywhere
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">45+</div>
                <div className="text-white/80 font-medium">Partner Organizations</div>
                <div className="text-white/60 text-sm mt-1">Across Chandigarh</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80 font-medium">Community Volunteers</div>
                <div className="text-white/60 text-sm mt-1">Chandigarh residents</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">25+</div>
                <div className="text-white/80 font-medium">Collection Points</div>
                <div className="text-white/60 text-sm mt-1">Across all sectors</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Our Partner Types</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏫</span>
                  </div>
                  <div className="font-semibold text-white mb-2">Schools & Colleges</div>
                  <div className="text-white/70 text-sm">PU Campus, GCG, PEC</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="font-semibold text-white mb-2">Corporate Offices</div>
                  <div className="text-white/70 text-sm">IT Park, Industrial Area</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <div className="font-semibold text-white mb-2">Retail Stores</div>
                  <div className="text-white/70 text-sm">Sector 17, 22, 35 markets</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏘️</span>
                  </div>
                  <div className="font-semibold text-white mb-2">RWAs & Societies</div>
                  <div className="text-white/70 text-sm">All sector associations</div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  Become a Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Routes Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Our Collection Routes
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                We cover major cities with regular pickup schedules. Find your area and collection timing.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-gray-800">Active Routes</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Search Chandigarh sectors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                      Search
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoutes.map((route, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{route.area}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          route.status === "Active" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {route.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{route.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{route.nextPickup}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toast.success(`Schedule details for ${route.area} sent to your email!`)}
                        className="w-full mt-3 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors text-sm"
                      >
                        View Schedule
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Dashboard Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold mb-6">
                <span className="text-2xl">🌍</span>
                Our Impact
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-6">
                Together We're Making a Difference
              </h2>
              <p className="text-xl text-white/80 font-light max-w-3xl mx-auto">
                See how our collective efforts are creating a sustainable future
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">♻️</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">2.5M kg</div>
                <div className="text-white/80 font-medium">Fabrics Recycled in Chandigarh</div>
                <div className="text-white/60 text-sm mt-1">Since 2020</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                <div className="text-white/80 font-medium">Chandigarh Residents Served</div>
                <div className="text-white/60 text-sm mt-1">Across all sectors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌳</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-white/80 font-medium">Trees Saved Equivalent</div>
                <div className="text-white/60 text-sm mt-1">Environmental impact</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💧</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">50M L</div>
                <div className="text-white/80 font-medium">Water Conserved</div>
                <div className="text-white/60 text-sm mt-1">Through recycling efforts</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Monthly Collection Stats</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Collection Trends</h4>
                  <div className="space-y-3">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 text-sm text-white/80">{month}</div>
                        <div className="flex-1 bg-white/20 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full transition-all duration-500" 
                            style={{width: `${Math.max(30, 60 + index * 8)}%`}} 
                          />
                        </div>
                        <div className="w-16 text-sm text-white font-medium">{Math.max(30, 60 + index * 8)}kg</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Top Contributors</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                          <span className="text-white text-sm">🏢</span>
                        </div>
                        <div className="text-white">Tech Corp</div>
                      </div>
                      <div className="text-emerald-300 font-semibold">500kg</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm">🏫</span>
                        </div>
                        <div className="text-white">City University</div>
                      </div>
                      <div className="text-blue-300 font-semibold">350kg</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm">🏘️</span>
                        </div>
                        <div className="text-white">Green Community</div>
                      </div>
                      <div className="text-purple-300 font-semibold">280kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classifier Section */}
      <section id="classify" className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Classify Your Textile
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Take a clear photo of the fabric — the closer, the better
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              {!selectedImage ? (
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                  isAnalyzing={isAnalyzing}
                />
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected fabric"
                      className="w-full h-64 object-cover rounded-2xl"
                    />
                    <button
                      onClick={handleClear}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ArrowDown className="w-5 h-5 text-gray-600 rotate-180" />
                    </button>
                  </div>
                  
                  {!isAnalyzing && !result && (
                    <Button
                      onClick={handleAnalyze}
                      className="w-full font-display text-lg py-6 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-2xl"
                    >
                      Analyze Fabric
                    </Button>
                  )}
                  
                  {isAnalyzing && <AnalyzingState />}
                  
                  {result && <ClassificationResult result={result} />}
                  
                  {result && (
                    <Button
                      onClick={handleClear}
                      className="w-full font-display text-lg py-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-2xl"
                    >
                      Classify Another Fabric
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* eBay-Style Marketplace Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Fabric Marketplace
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Buy and sell fabrics directly with our community. New, used, vintage, and upcycled materials available.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">847</div>
                <div className="text-gray-600 font-medium">Active Listings</div>
                <div className="text-sm text-gray-500 mt-1">Chandigarh marketplace</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">3,432</div>
                <div className="text-gray-600 font-medium">Chandigarh Members</div>
                <div className="text-sm text-gray-500 mt-1">Active traders</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">♻️</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">12.3K</div>
                <div className="text-gray-600 font-medium">Items Recycled</div>
                <div className="text-sm text-gray-500 mt-1">Through local marketplace</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">4.8</div>
                <div className="text-gray-600 font-medium">Avg Rating</div>
                <div className="text-sm text-gray-500 mt-1">From 847 reviews</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">All Items</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">New</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Used</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Vintage</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Upcycled</button>
                  </div>
                  <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500">
                      <option>Sort: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest First</option>
                    </select>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">
                      + List Item
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(() => {
                    const marketplaceItems = [
                      { 
                        id: 'item1',
                        title: "Premium Organic Cotton Lot", 
                        price: 45, 
                        image: "🌱", 
                        seller: "EcoTextiles Pro",
                        rating: 4.9,
                        bids: 12,
                        timeLeft: "2h 15m",
                        condition: "New"
                      },
                      { 
                        id: 'item2',
                        title: "Vintage Denim Collection", 
                        price: 28, 
                        image: "👖", 
                        seller: "RetroFashion",
                        rating: 4.8,
                        bids: 8,
                        timeLeft: "5h 30m",
                        condition: "Vintage"
                      },
                      { 
                        id: 'item3',
                        title: "Upcycled Silk Scarves Set", 
                        price: 35, 
                        image: "🎭", 
                        seller: "GreenCrafts",
                        rating: 5.0,
                        bids: 15,
                        timeLeft: "1h 45m",
                        condition: "Upcycled"
                      },
                      { 
                        id: 'item4',
                        title: "Bulk Polyester Fabric Roll", 
                        price: 22, 
                        image: "♻️", 
                        seller: "FabricWholesale",
                        rating: 4.7,
                        bids: 6,
                        timeLeft: "12h 20m",
                        condition: "New"
                      },
                      { 
                        id: 'item5',
                        title: "Hand-Dyed Linen Bundle", 
                        price: 52, 
                        image: "☘️", 
                        seller: "NaturalDyes Co",
                        rating: 4.9,
                        bids: 18,
                        timeLeft: "3h 10m",
                        condition: "New"
                      },
                      { 
                        id: 'item6',
                        title: "Wool Sweater Yarn Lot", 
                        price: 38, 
                        image: "🐑", 
                        seller: "CozyYarns",
                        rating: 4.6,
                        bids: 9,
                        timeLeft: "8h 45m",
                        condition: "Used"
                      },
                      { 
                        id: 'item7',
                        title: "Designer Fabric Remnants", 
                        price: 67, 
                        image: "🎨", 
                        seller: "LuxuryTextiles",
                        rating: 4.8,
                        bids: 22,
                        timeLeft: "45m",
                        condition: "New"
                      },
                      { 
                        id: 'item8',
                        title: "Recycled Canvas Fabric", 
                        price: 19, 
                        image: "🏕️", 
                        seller: "EcoCanvas",
                        rating: 4.5,
                        bids: 4,
                        timeLeft: "1d 2h",
                        condition: "Recycled"
                      }
                    ];

                    const getCurrentPrice = (item: typeof marketplaceItems[0]) => {
                      return bids[item.id] || item.price;
                    };

                    const getCurrentBids = (item: typeof marketplaceItems[0]) => {
                      return bids[item.id] ? item.bids + 1 : item.bids;
                    };

                    return marketplaceItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl">{item.image}</span>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium">
                              {item.condition}
                            </span>
                          </div>
                          {item.timeLeft.includes('m') && (
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium">
                                {item.timeLeft}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h4>
                          <div className="text-sm text-gray-600 mb-2">{item.seller}</div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-bold text-blue-600">${getCurrentPrice(item)}</div>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-yellow-500">⭐</span>
                              <span className="font-medium">{item.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{getCurrentBids(item)} bids</span>
                            <button 
                              onClick={() => handleBid(item.id, getCurrentPrice(item))}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              {item.timeLeft.includes('m') ? 'Place Bid' : 'Buy Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing 1-8 of 847 results
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                    <span className="px-3 py-1">...</span>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">106</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                What People Are Saying
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Join thousands of satisfied users making sustainable fashion choices
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 relative">
                <div className="absolute top-4 right-4 text-4xl text-purple-200">"</div>
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "The fashion industry's impact on climate change is catastrophic. We need innovative solutions like this platform that combine technology with sustainability to transform how we consume and dispose of textiles."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Stella McCartney</div>
                    <div className="text-sm text-gray-600">Sustainable Fashion Designer</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 relative">
                <div className="absolute top-4 right-4 text-4xl text-blue-200">"</div>
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "AI-powered fabric identification is the future of textile recycling. This technology can dramatically increase recycling rates and help us build a truly circular fashion economy."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Dr. Andrew Morlet</div>
                    <div className="text-sm text-gray-600">CEO, Ellen MacArthur Foundation</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 relative">
                <div className="absolute top-4 right-4 text-4xl text-emerald-200">"</div>
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "Every individual has the power to change the fashion industry. Tools that make textile recycling accessible and transparent are crucial for creating a sustainable future."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Livia Firth</div>
                    <div className="text-sm text-gray-600">Founder, Green Carpet Fashion Awards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-t border-gray-200 py-16 mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                FabricSort
              </h3>
            </div>
            <p className="text-gray-600 text-lg font-light mb-8">
              AI-powered textile waste classification for a sustainable future.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-500" />
                <span>Globally Accessible</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
