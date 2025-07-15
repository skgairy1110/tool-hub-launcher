import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PiggyBank, Calculator, TrendingUp } from 'lucide-react';

const PpfCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(150000);
  const [timePeriod, setTimePeriod] = useState<number>(15);
  const [results, setResults] = useState<any>(null);

  const calculatePPF = () => {
    const rate = 7.1 / 100; // Current PPF rate
    let totalAmount = 0;
    
    for (let year = 1; year <= timePeriod; year++) {
      totalAmount = (totalAmount + yearlyInvestment) * (1 + rate);
    }
    
    const totalInvestment = yearlyInvestment * timePeriod;
    const totalInterest = totalAmount - totalInvestment;
    
    setResults({
      maturityAmount: Math.round(totalAmount),
      totalInvestment: totalInvestment,
      totalInterest: Math.round(totalInterest),
      rate: 7.1
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <PiggyBank className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">PPF Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Public Provident Fund maturity amount and returns
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                PPF Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="yearly-investment" className="text-base font-medium">
                  Yearly Investment Amount
                </Label>
                <Input
                  id="yearly-investment"
                  type="number"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter yearly investment"
                />
                <p className="text-sm text-gray-500 mt-1">Maximum ₹1,50,000 per year allowed</p>
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
                <p className="text-sm text-gray-500 mt-1">Minimum 15 years lock-in period</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current PPF Interest Rate:</strong> 7.1% per annum (compounded annually)
                </p>
              </div>

              <Button 
                onClick={calculatePPF}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
              >
                Calculate PPF Maturity
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Your PPF Results
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
                    <p className="text-sm text-gray-600">Total Interest Earned</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.totalInterest)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Maturity Amount</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(results.maturityAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Yearly Investment:</span>
                      <span className="font-medium">{formatCurrency(yearlyInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-medium">{timePeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{results.rate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Multiple:</span>
                      <span className="font-medium text-green-600">
                        {(results.maturityAmount / results.totalInvestment).toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PpfCalculator;