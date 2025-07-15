import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, PiggyBank } from 'lucide-react';

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [results, setResults] = useState<any>(null);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / (12 * 100);
    const months = timePeriod * 12;
    
    // SIP Future Value Formula: M * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvestment = monthlyInvestment * months;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">SIP Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Systematic Investment Plan returns and plan your wealth creation journey
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                SIP Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="monthly-investment" className="text-base font-medium">
                  Monthly Investment Amount
                </Label>
                <Input
                  id="monthly-investment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter amount"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum ₹500 recommended</p>
              </div>

              <div>
                <Label htmlFor="expected-return" className="text-base font-medium">
                  Expected Annual Return (%)
                </Label>
                <Input
                  id="expected-return"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="mt-2 text-lg"
                  step="0.5"
                  placeholder="Enter percentage"
                />
                <p className="text-sm text-gray-500 mt-1">Equity mutual funds average 10-15% annually</p>
              </div>

              <div>
                <Label htmlFor="time-period" className="text-base font-medium">
                  Investment Period (Years)
                </Label>
                <Input
                  id="time-period"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter years"
                />
                <p className="text-sm text-gray-500 mt-1">Longer periods benefit from compounding</p>
              </div>

              <Button 
                onClick={calculateSIP}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
              >
                Calculate SIP Returns
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-green-600" />
                  Your SIP Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Total Investment</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.totalInvestment)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Estimated Returns</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.wealthGained)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(results.futureValue)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly SIP:</span>
                      <span className="font-medium">{formatCurrency(monthlyInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Duration:</span>
                      <span className="font-medium">{timePeriod} years ({timePeriod * 12} months)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return:</span>
                      <span className="font-medium">{expectedReturn}% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Multiple:</span>
                      <span className="font-medium text-green-600">
                        {(results.futureValue / results.totalInvestment).toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Power of Compounding</h3>
            <p className="text-sm text-gray-600">Your money grows exponentially over time through compound interest</p>
          </Card>
          
          <Card className="text-center p-6">
            <Calculator className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Disciplined Investing</h3>
            <p className="text-sm text-gray-600">Regular monthly investments help build wealth systematically</p>
          </Card>
          
          <Card className="text-center p-6">
            <PiggyBank className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Long-term Wealth</h3>
            <p className="text-sm text-gray-600">Start early and stay invested for maximum wealth creation</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;