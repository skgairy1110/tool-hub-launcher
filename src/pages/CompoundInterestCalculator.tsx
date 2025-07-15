import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calculator, BarChart3 } from 'lucide-react';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [time, setTime] = useState<number>(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12);
  const [results, setResults] = useState<any>(null);

  const calculateCompoundInterest = () => {
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + (rate / 100) / compoundingFrequency, compoundingFrequency * time);
    const compoundInterest = amount - principal;
    
    setResults({
      finalAmount: Math.round(amount),
      compoundInterest: Math.round(compoundInterest),
      principal: principal
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCompoundingText = (frequency: number) => {
    switch (frequency) {
      case 1: return 'Annually';
      case 2: return 'Semi-annually';
      case 4: return 'Quarterly';
      case 12: return 'Monthly';
      case 365: return 'Daily';
      default: return 'Monthly';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Compound Interest Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate the power of compound interest on your investments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="principal" className="text-base font-medium">
                  Principal Amount
                </Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter principal amount"
                />
                <p className="text-sm text-gray-500 mt-1">Initial investment amount</p>
              </div>

              <div>
                <Label htmlFor="rate" className="text-base font-medium">
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-2 text-lg"
                  step="0.1"
                  placeholder="Enter interest rate"
                />
                <p className="text-sm text-gray-500 mt-1">Expected annual return rate</p>
              </div>

              <div>
                <Label htmlFor="time" className="text-base font-medium">
                  Investment Period (Years)
                </Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter years"
                />
                <p className="text-sm text-gray-500 mt-1">Investment duration</p>
              </div>

              <div>
                <Label className="text-base font-medium">Compounding Frequency</Label>
                <Select value={compoundingFrequency.toString()} onValueChange={(value) => setCompoundingFrequency(Number(value))}>
                  <SelectTrigger className="mt-2 text-lg">
                    <SelectValue placeholder="Select compounding frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually</SelectItem>
                    <SelectItem value="2">Semi-annually</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="365">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">How often interest is compounded</p>
              </div>

              <Button 
                onClick={calculateCompoundInterest}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
              >
                Calculate Compound Interest
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Compound Interest Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Principal Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.principal)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Compound Interest Earned</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.compoundInterest)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Final Amount</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(results.finalAmount)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principal:</span>
                      <span className="font-medium">{formatCurrency(principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{rate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Period:</span>
                      <span className="font-medium">{time} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compounding:</span>
                      <span className="font-medium">{getCompoundingText(compoundingFrequency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Multiple:</span>
                      <span className="font-medium text-green-600">
                        {(results.finalAmount / results.principal).toFixed(2)}x
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

export default CompoundInterestCalculator;