import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Repeat, Calculator, TrendingUp } from 'lucide-react';

const RdCalculator = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [timePeriod, setTimePeriod] = useState<number>(5);
  const [results, setResults] = useState<any>(null);

  const calculateRD = () => {
    const months = timePeriod * 12;
    const monthlyRate = interestRate / (12 * 100);
    
    // RD Formula: M * [(1 + r)^n - 1] / [1 - (1 + r)^(-1/3)]
    const maturityAmount = monthlyDeposit * (months * (months + 1) / 2) * (monthlyRate / 12 + 1);
    
    const totalDeposit = monthlyDeposit * months;
    const totalInterest = maturityAmount - totalDeposit;
    
    setResults({
      maturityAmount: Math.round(maturityAmount),
      totalDeposit: totalDeposit,
      totalInterest: Math.round(totalInterest)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Repeat className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">RD Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Recurring Deposit maturity amount and interest earned
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                RD Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="monthly-deposit" className="text-base font-medium">
                  Monthly Deposit Amount
                </Label>
                <Input
                  id="monthly-deposit"
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter monthly deposit"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum ₹100 per month</p>
              </div>

              <div>
                <Label htmlFor="interest-rate" className="text-base font-medium">
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="mt-2 text-lg"
                  step="0.1"
                  placeholder="Enter interest rate"
                />
                <p className="text-sm text-gray-500 mt-1">Current RD rates: 5.5% - 7.5%</p>
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
                <p className="text-sm text-gray-500 mt-1">Typically 1-10 years</p>
              </div>

              <Button 
                onClick={calculateRD}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
              >
                Calculate RD Maturity
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Your RD Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Total Deposits</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.totalDeposit)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Interest Earned</p>
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
                      <span>Monthly Deposit:</span>
                      <span className="font-medium">{formatCurrency(monthlyDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-medium">{timePeriod} years ({timePeriod * 12} months)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{interestRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Multiple:</span>
                      <span className="font-medium text-green-600">
                        {(results.maturityAmount / results.totalDeposit).toFixed(2)}x
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

export default RdCalculator;