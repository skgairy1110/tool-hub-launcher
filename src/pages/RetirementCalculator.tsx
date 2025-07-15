import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock, Calculator, Target } from 'lucide-react';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
  const [expectedInflation, setExpectedInflation] = useState<number>(6);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(500000);
  const [results, setResults] = useState<any>(null);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = 25; // Assuming 25 years post retirement
    
    // Future monthly expenses adjusted for inflation
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + expectedInflation / 100, yearsToRetirement);
    
    // Total corpus needed at retirement
    const totalCorpusNeeded = futureMonthlyExpenses * 12 * retirementYears;
    
    // Future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Additional corpus needed
    const additionalCorpusNeeded = Math.max(0, totalCorpusNeeded - futureValueCurrentSavings);
    
    // Monthly SIP required
    const monthlyRate = expectedReturn / (12 * 100);
    const months = yearsToRetirement * 12;
    const monthlySIPNeeded = additionalCorpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    setResults({
      yearsToRetirement,
      futureMonthlyExpenses: Math.round(futureMonthlyExpenses),
      totalCorpusNeeded: Math.round(totalCorpusNeeded),
      futureValueCurrentSavings: Math.round(futureValueCurrentSavings),
      additionalCorpusNeeded: Math.round(additionalCorpusNeeded),
      monthlySIPNeeded: Math.round(monthlySIPNeeded)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Retirement Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plan your retirement corpus and monthly investment requirements
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-orange-600" />
                Retirement Planning Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-age" className="text-base font-medium">
                    Current Age
                  </Label>
                  <Input
                    id="current-age"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="mt-2 text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="retirement-age" className="text-base font-medium">
                    Retirement Age
                  </Label>
                  <Input
                    id="retirement-age"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="mt-2 text-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monthly-expenses" className="text-base font-medium">
                  Current Monthly Expenses
                </Label>
                <Input
                  id="monthly-expenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Current lifestyle expenses"
                />
                <p className="text-sm text-gray-500 mt-1">Your current monthly lifestyle expenses</p>
              </div>

              <div>
                <Label htmlFor="current-savings" className="text-base font-medium">
                  Current Savings/Investments
                </Label>
                <Input
                  id="current-savings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Total current savings"
                />
                <p className="text-sm text-gray-500 mt-1">Existing retirement corpus</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expected-inflation" className="text-base font-medium">
                    Expected Inflation (%)
                  </Label>
                  <Input
                    id="expected-inflation"
                    type="number"
                    value={expectedInflation}
                    onChange={(e) => setExpectedInflation(Number(e.target.value))}
                    className="mt-2 text-lg"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="expected-return" className="text-base font-medium">
                    Expected Return (%)
                  </Label>
                  <Input
                    id="expected-return"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="mt-2 text-lg"
                    step="0.1"
                  />
                </div>
              </div>

              <Button 
                onClick={calculateRetirement}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6"
              >
                Calculate Retirement Plan
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-600" />
                  Your Retirement Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Future Monthly Expenses</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.futureMonthlyExpenses)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Total Corpus Needed</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCrores(results.totalCorpusNeeded)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Future Value of Current Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCrores(results.futureValueCurrentSavings)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600">Monthly SIP Required</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {formatCurrency(results.monthlySIPNeeded)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Retirement Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Years to Retirement:</span>
                      <span className="font-medium">{results.yearsToRetirement} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Inflation:</span>
                      <span className="font-medium">{expectedInflation}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return:</span>
                      <span className="font-medium">{expectedReturn}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Corpus Needed:</span>
                      <span className="font-medium text-orange-600">
                        {formatCrores(results.additionalCorpusNeeded)}
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

export default RetirementCalculator;