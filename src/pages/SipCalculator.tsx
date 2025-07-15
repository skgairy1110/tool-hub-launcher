import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, PiggyBank, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [results, setResults] = useState<{
    futureValue: number;
    totalInvestment: number;
    wealthGained: number;
  } | null>(null);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    
    // SIP formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvestment = monthlyInvestment * totalMonths;
    const wealthGained = futureValue - totalInvestment;

    setResults({
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      wealthGained: Math.round(wealthGained)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              SIP Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate the future value of your Systematic Investment Plan (SIP) investments and see how compound interest can grow your wealth over time.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyInvestment" className="text-sm font-medium text-gray-700">
                  Monthly Investment Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="monthlyInvestment"
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="pl-8 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    min="500"
                    max="1000000"
                  />
                </div>
                <p className="text-xs text-gray-500">Minimum: ₹500, Maximum: ₹10,00,000</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturn" className="text-sm font-medium text-gray-700">
                  Expected Annual Return (%)
                </Label>
                <div className="relative">
                  <Input
                    id="expectedReturn"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    min="1"
                    max="30"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500">Typically 8-15% for equity mutual funds</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePeriod" className="text-sm font-medium text-gray-700">
                  Investment Period (Years)
                </Label>
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  min="1"
                  max="40"
                />
                <p className="text-xs text-gray-500">Long-term investments yield better returns</p>
              </div>

              <Button 
                onClick={calculateSIP}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate SIP Returns
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Investment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Future Value</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(results.futureValue)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total Investment</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatCurrency(results.totalInvestment)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Wealth Gained</span>
                        <span className="text-xl font-bold text-purple-600">
                          {formatCurrency(results.wealthGained)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Investment Summary</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Monthly SIP Amount:</span>
                        <span className="font-medium">{formatCurrency(monthlyInvestment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Period:</span>
                        <span className="font-medium">{timePeriod} years ({timePeriod * 12} months)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span className="font-medium">{expectedReturn}% per annum</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return Multiple:</span>
                        <span className="font-medium text-green-600">
                          {(results.futureValue / results.totalInvestment).toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your investment details and click calculate to see potential returns</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What is SIP?</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Systematic Investment Plan</h4>
                  <p className="text-gray-600 mb-4">
                    SIP allows you to invest a fixed amount regularly in mutual funds, typically monthly. 
                    It helps in averaging the cost of investment and building wealth through the power of compounding.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Disciplined investing approach
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Rupee cost averaging benefits
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Power of compounding
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Key Benefits</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <strong>Flexibility:</strong> Start with as low as ₹500 per month
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <strong>Convenience:</strong> Automated monthly investments
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <div>
                        <strong>Goal-based:</strong> Perfect for long-term financial goals
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;