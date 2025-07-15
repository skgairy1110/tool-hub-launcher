import { Link } from "react-router-dom";
import { Calculator, PiggyBank, Receipt, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const toolCategories = [
    {
      id: 'interest-calculators',
      title: 'Interest Calculators',
      description: 'Calculate returns on FD, RD, PPF, SIP, Mutual Funds & more investment options',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      tools: [
        { name: 'FD Calculator', path: '/fd-calculator' },
        { name: 'RD Calculator', path: '/rd-calculator' },
        { name: 'PPF Calculator', path: '/ppf-calculator' },
        { name: 'Compound Interest Calculator', path: '/compound-interest' },
        { name: 'Lumpsum Investment Calculator', path: '/lumpsum-calculator' },
        { name: 'SIP Calculator', path: '/sip-calculator' },
        { name: 'Gold Investment Calculator', path: '/gold-calculator' },
        { name: 'Mutual Fund Returns Calculator', path: '/mutual-fund-calculator' }
      ]
    },
    {
      id: 'loan-calculators',
      title: 'Loan Calculators',
      description: 'Plan EMIs for home, personal, car, education loans & calculate gratuity',
      icon: Calculator,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
      tools: [
        { name: 'Home Loan Calculator', path: '/home-loan-calculator' },
        { name: 'Personal Loan Calculator', path: '/personal-loan-calculator' },
        { name: 'Car Loan Calculator', path: '/car-loan-calculator' },
        { name: 'Education Loan Calculator', path: '/education-loan-calculator' },
        { name: 'NPS Calculator', path: '/nps-calculator' },
        { name: 'EMI Calculator', path: '/emi-calculator' },
        { name: 'Gratuity Calculator', path: '/gratuity-calculator' }
      ]
    },
    {
      id: 'tax-calculators',
      title: 'Tax Calculators',
      description: 'Calculate income tax, capital gains tax, and HRA exemptions accurately',
      icon: Receipt,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-violet-700',
      tools: [
        { name: 'Income Tax Calculator', path: '/income-tax-calculator' },
        { name: 'Capital Gains Tax Calculator', path: '/capital-gains-calculator' },
        { name: 'HRA Calculator', path: '/hra-calculator' }
      ]
    },
    {
      id: 'retirement-planning',
      title: 'Retirement & Future Planning',
      description: 'Plan for retirement, education costs, and understand inflation impact',
      icon: PiggyBank,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
      tools: [
        { name: 'Retirement Calculator', path: '/retirement-calculator' },
        { name: "Children's Education Planner", path: '/education-planner' },
        { name: 'Inflation Calculator', path: '/inflation-calculator' }
      ]
    },
    {
      id: 'other-tools',
      title: 'Other Useful Tools',
      description: 'Budget planning, currency conversion, and health insurance calculators',
      icon: Wallet,
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-100',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-cyan-700',
      tools: [
        { name: 'Budget Planner', path: '/budget-planner' },
        { name: 'Currency Converter', path: '/currency-converter' },
        { name: 'Health Insurance Premium Calculator', path: '/health-insurance-calculator' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Financial Calculator Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Complete suite of financial calculators for smart money planning. Calculate EMIs, investments, taxes, and plan your financial future.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>All tools are free to use</span>
          </div>
        </div>

        {/* Calculator Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {toolCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 shadow-lg overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${category.gradient}`}></div>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`${category.iconBg} p-3 rounded-xl`}>
                      <IconComponent className={`h-8 w-8 ${category.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      
                      {/* Tools List */}
                      <div className="space-y-2">
                        {category.tools.map((tool, index) => (
                          <Link 
                            key={index} 
                            to={tool.path}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool"
                          >
                            <span className="text-sm text-gray-700 group-hover/tool:text-gray-900">
                              {tool.name}
                            </span>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover/tool:text-gray-600 transform group-hover/tool:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">{category.tools.length} calculators</span>
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${category.gradient} ${category.hoverColor} text-white rounded-lg transition-all duration-300 group-hover:shadow-lg`}>
                      <span className="text-sm font-medium">Explore All</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Financial Calculators?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate & Updated</h3>
              <p className="text-gray-600 text-sm">Latest tax slabs, interest rates, and financial formulas for precise calculations.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Planning</h3>
              <p className="text-gray-600 text-sm">Make informed financial decisions with detailed breakdowns and projections.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Suite</h3>
              <p className="text-gray-600 text-sm">Everything you need for financial planning in one comprehensive platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
