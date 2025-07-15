import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Home, CreditCard, TrendingDown } from 'lucide-react';

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [results, setResults] = useState<any>(null);

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const months = loanTenure * 12;
    
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    
    setResults({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <Calculator className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">EMI Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Equated Monthly Installment for home loans, personal loans, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loan-amount" className="text-base font-medium">
                  Loan Amount
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter loan amount"
                />
                <p className="text-sm text-gray-500 mt-1">Total amount you want to borrow</p>
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
                <p className="text-sm text-gray-500 mt-1">Current home loan rates: 8-10%</p>
              </div>

              <div>
                <Label htmlFor="loan-tenure" className="text-base font-medium">
                  Loan Tenure (Years)
                </Label>
                <Input
                  id="loan-tenure"
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter tenure in years"
                />
                <p className="text-sm text-gray-500 mt-1">Typical range: 15-30 years</p>
              </div>

              <Button 
                onClick={calculateEMI}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6"
              >
                Calculate EMI
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-red-600" />
                  EMI Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500 text-center">
                    <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {formatCurrency(results.emi)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600">Principal Amount</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(results.principal)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                      <p className="text-sm text-gray-600">Total Interest</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(results.totalInterest)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Total Payment</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(results.totalPayment)}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Loan Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly EMI:</span>
                      <span className="font-medium">{formatCurrency(results.emi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan Duration:</span>
                      <span className="font-medium">{loanTenure} years ({loanTenure * 12} months)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{interestRate}% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Principal vs Interest:</span>
                      <span className="font-medium">
                        {((results.principal / results.totalPayment) * 100).toFixed(1)}% : {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-center">Interest vs Principal</h4>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500"
                      style={{ width: `${(results.principal / results.totalPayment) * 100}%` }}
                      title={`Principal: ${formatCurrency(results.principal)}`}
                    ></div>
                    <div 
                      className="bg-red-500"
                      style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                      title={`Interest: ${formatCurrency(results.totalInterest)}`}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-blue-600">Principal ({((results.principal / results.totalPayment) * 100).toFixed(1)}%)</span>
                    <span className="text-red-600">Interest ({((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <TrendingDown className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Lower Interest Tips</h3>
            <p className="text-sm text-gray-600">Compare rates from multiple lenders and negotiate for better terms</p>
          </Card>
          
          <Card className="text-center p-6">
            <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Shorter Tenure</h3>
            <p className="text-sm text-gray-600">Choose shorter tenure to pay less total interest, if you can afford higher EMIs</p>
          </Card>
          
          <Card className="text-center p-6">
            <Home className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Prepayment Benefits</h3>
            <p className="text-sm text-gray-600">Make prepayments to reduce principal and save on interest costs</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;