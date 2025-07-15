import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PiggyBank, TrendingUp, Calendar, Calculator } from 'lucide-react';

const FdCalculator = () => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [tenure, setTenure] = useState<number>(1);
  const [tenureType, setTenureType] = useState<string>('years');
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('quarterly');
  const [results, setResults] = useState<any>(null);

  const getCompoundingPerYear = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'half-yearly': return 2;
      case 'yearly': return 1;
      default: return 4;
    }
  };

  const calculateFD = () => {
    const tenureInYears = tenureType === 'months' ? tenure / 12 : tenure;
    const n = getCompoundingPerYear(compoundingFrequency);
    const rate = interestRate / 100;
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + (rate / n), n * tenureInYears);
    const interestEarned = maturityAmount - principal;
    
    // Calculate monthly interest for display
    const monthlyInterest = interestEarned / (tenureInYears * 12);
    
    setResults({
      maturityAmount: Math.round(maturityAmount),
      interestEarned: Math.round(interestEarned),
      monthlyInterest: Math.round(monthlyInterest),
      principal: principal,
      effectiveRate: ((maturityAmount / principal - 1) / tenureInYears * 100).toFixed(2)
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <PiggyBank className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">FD Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Fixed Deposit maturity amount and interest earnings with compound interest
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                FD Investment Details
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
                  placeholder="Enter FD amount"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum amount varies by bank (usually ₹1,000)</p>
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
                <p className="text-sm text-gray-500 mt-1">Current FD rates: 5.5% - 7.5% for most banks</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenure" className="text-base font-medium">
                    Tenure
                  </Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="mt-2 text-lg"
                    placeholder="Enter tenure"
                  />
                </div>
                
                <div>
                  <Label className="text-base font-medium">
                    Period
                  </Label>
                  <Select value={tenureType} onValueChange={setTenureType}>
                    <SelectTrigger className="mt-2 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Compounding Frequency
                </Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger className="mt-2 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Most banks compound quarterly</p>
              </div>

              <Button 
                onClick={calculateFD}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-6"
              >
                Calculate FD Maturity
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  FD Maturity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 text-center">
                    <p className="text-sm text-gray-600 mb-2">Maturity Amount</p>
                    <p className="text-4xl font-bold text-green-600">
                      {formatCurrency(results.maturityAmount)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600">Principal</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(results.principal)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                      <p className="text-sm text-gray-600">Interest Earned</p>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(results.interestEarned)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600">Average Monthly Interest</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(results.monthlyInterest)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principal Amount:</span>
                      <span className="font-medium">{formatCurrency(results.principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Period:</span>
                      <span className="font-medium">
                        {tenure} {tenureType} 
                        {tenureType === 'months' ? ` (${(tenure/12).toFixed(1)} years)` : ` (${tenure * 12} months)`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{interestRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compounding:</span>
                      <span className="font-medium capitalize">{compoundingFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Yield:</span>
                      <span className="font-medium text-green-600">{results.effectiveRate}% annually</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-center">Growth Visualization</h4>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500"
                      style={{ width: `${(results.principal / results.maturityAmount) * 100}%` }}
                      title={`Principal: ${formatCurrency(results.principal)}`}
                    ></div>
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(results.interestEarned / results.maturityAmount) * 100}%` }}
                      title={`Interest: ${formatCurrency(results.interestEarned)}`}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-blue-600">Principal ({((results.principal / results.maturityAmount) * 100).toFixed(1)}%)</span>
                    <span className="text-green-600">Interest ({((results.interestEarned / results.maturityAmount) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <PiggyBank className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Safe Investment</h3>
            <p className="text-sm text-gray-600">FDs are guaranteed returns with DICGC insurance up to ₹5 lakhs</p>
          </Card>
          
          <Card className="text-center p-6">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Flexible Terms</h3>
            <p className="text-sm text-gray-600">Choose from 7 days to 10 years tenure based on your financial goals</p>
          </Card>
          
          <Card className="text-center p-6">
            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Compound Growth</h3>
            <p className="text-sm text-gray-600">Interest compounds to accelerate your wealth growth over time</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FdCalculator;