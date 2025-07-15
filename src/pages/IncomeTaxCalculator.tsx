import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, Calculator, Shield, TrendingDown } from 'lucide-react';

const IncomeTaxCalculator = () => {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [taxRegime, setTaxRegime] = useState<string>('new');
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [results, setResults] = useState<any>(null);

  const calculateTax = () => {
    let taxableIncome = grossIncome;
    let totalDeductions = 0;
    
    if (taxRegime === 'old') {
      // Standard deduction
      const standardDeduction = Math.min(50000, grossIncome);
      totalDeductions += standardDeduction;
      
      // 80C deductions (max 1.5 lakh)
      const deduction80C = Math.min(deductions80C, 150000);
      totalDeductions += deduction80C;
      
      // 80D deductions (health insurance)
      totalDeductions += deductions80D;
      
      // Other deductions
      totalDeductions += otherDeductions;
      
      taxableIncome = Math.max(0, grossIncome - totalDeductions);
    } else {
      // New regime - standard deduction only
      const standardDeduction = Math.min(50000, grossIncome);
      totalDeductions += standardDeduction;
      taxableIncome = Math.max(0, grossIncome - standardDeduction);
    }

    let tax = 0;
    let cess = 0;

    if (taxRegime === 'new') {
      // New Tax Regime 2023-24
      if (taxableIncome > 300000) {
        tax += Math.min(taxableIncome - 300000, 300000) * 0.05; // 5% for 3L-6L
      }
      if (taxableIncome > 600000) {
        tax += Math.min(taxableIncome - 600000, 300000) * 0.10; // 10% for 6L-9L
      }
      if (taxableIncome > 900000) {
        tax += Math.min(taxableIncome - 900000, 300000) * 0.15; // 15% for 9L-12L
      }
      if (taxableIncome > 1200000) {
        tax += Math.min(taxableIncome - 1200000, 300000) * 0.20; // 20% for 12L-15L
      }
      if (taxableIncome > 1500000) {
        tax += (taxableIncome - 1500000) * 0.30; // 30% for above 15L
      }
    } else {
      // Old Tax Regime
      if (taxableIncome > 250000) {
        tax += Math.min(taxableIncome - 250000, 250000) * 0.05; // 5% for 2.5L-5L
      }
      if (taxableIncome > 500000) {
        tax += Math.min(taxableIncome - 500000, 500000) * 0.20; // 20% for 5L-10L
      }
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.30; // 30% for above 10L
      }
    }

    // Health and Education Cess (4%)
    cess = tax * 0.04;
    const totalTax = tax + cess;

    const netIncome = grossIncome - totalTax;
    const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome * 100) : 0;
    const monthlySalary = netIncome / 12;

    setResults({
      grossIncome,
      taxableIncome,
      totalDeductions,
      tax,
      cess,
      totalTax,
      netIncome,
      effectiveTaxRate: effectiveTaxRate.toFixed(2),
      monthlySalary,
      taxSaved: taxRegime === 'old' ? (deductions80C + deductions80D + otherDeductions) * 0.30 : 0
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Receipt className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Income Tax Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your income tax liability for FY 2023-24 under both old and new tax regimes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                Income & Tax Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="gross-income" className="text-base font-medium">
                  Annual Gross Income
                </Label>
                <Input
                  id="gross-income"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter annual income"
                />
                <p className="text-sm text-gray-500 mt-1">Include salary, bonus, allowances, etc.</p>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Tax Regime
                </Label>
                <Select value={taxRegime} onValueChange={setTaxRegime}>
                  <SelectTrigger className="mt-2 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Tax Regime (2023-24)</SelectItem>
                    <SelectItem value="old">Old Tax Regime</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  {taxRegime === 'new' ? 'Lower rates but fewer deductions' : 'Higher rates but more deductions allowed'}
                </p>
              </div>

              {taxRegime === 'old' && (
                <>
                  <div>
                    <Label htmlFor="deductions-80c" className="text-base font-medium">
                      80C Deductions (PPF, ELSS, EPF, etc.)
                    </Label>
                    <Input
                      id="deductions-80c"
                      type="number"
                      value={deductions80C}
                      onChange={(e) => setDeductions80C(Number(e.target.value))}
                      className="mt-2 text-lg"
                      placeholder="Max ₹1,50,000"
                    />
                    <p className="text-sm text-gray-500 mt-1">Maximum allowed: ₹1,50,000</p>
                  </div>

                  <div>
                    <Label htmlFor="deductions-80d" className="text-base font-medium">
                      80D Deductions (Health Insurance)
                    </Label>
                    <Input
                      id="deductions-80d"
                      type="number"
                      value={deductions80D}
                      onChange={(e) => setDeductions80D(Number(e.target.value))}
                      className="mt-2 text-lg"
                      placeholder="Health insurance premiums"
                    />
                    <p className="text-sm text-gray-500 mt-1">Up to ₹25,000 (₹50,000 for senior citizens)</p>
                  </div>

                  <div>
                    <Label htmlFor="other-deductions" className="text-base font-medium">
                      Other Deductions (80E, 80G, etc.)
                    </Label>
                    <Input
                      id="other-deductions"
                      type="number"
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(Number(e.target.value))}
                      className="mt-2 text-lg"
                      placeholder="Education loan, donations, etc."
                    />
                  </div>
                </>
              )}

              <Button 
                onClick={calculateTax}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
              >
                Calculate Tax
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Tax Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500 text-center">
                    <p className="text-sm text-gray-600 mb-2">Total Tax Liability</p>
                    <p className="text-4xl font-bold text-red-600">
                      {formatCurrency(results.totalTax)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                      <p className="text-sm text-gray-600">Net Annual Income</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(results.netIncome)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                      <p className="text-sm text-gray-600">Monthly Take-home</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(results.monthlySalary)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Effective Tax Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {results.effectiveTaxRate}%
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Tax Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Income:</span>
                      <span className="font-medium">{formatCurrency(results.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span className="font-medium text-green-600">-{formatCurrency(results.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Income:</span>
                      <span className="font-medium">{formatCurrency(results.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax:</span>
                      <span className="font-medium text-red-600">{formatCurrency(results.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health & Education Cess (4%):</span>
                      <span className="font-medium text-red-600">{formatCurrency(results.cess)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total Tax:</span>
                      <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
                    </div>
                  </div>
                </div>

                {taxRegime === 'old' && results.taxSaved > 0 && (
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-800">Tax Savings</h4>
                    <p className="text-sm text-green-700">
                      You saved approximately <span className="font-bold">{formatCurrency(results.taxSaved)}</span> in taxes through deductions under the old regime.
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-red-100 to-green-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-center">Income vs Tax</h4>
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(results.netIncome / results.grossIncome) * 100}%` }}
                      title={`Net Income: ${formatCurrency(results.netIncome)}`}
                    ></div>
                    <div 
                      className="bg-red-500"
                      style={{ width: `${(results.totalTax / results.grossIncome) * 100}%` }}
                      title={`Tax: ${formatCurrency(results.totalTax)}`}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-green-600">Net Income ({((results.netIncome / results.grossIncome) * 100).toFixed(1)}%)</span>
                    <span className="text-red-600">Tax ({results.effectiveTaxRate}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <TrendingDown className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Tax Planning</h3>
            <p className="text-sm text-gray-600">Optimize your tax liability through smart investment planning</p>
          </Card>
          
          <Card className="text-center p-6">
            <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Compare Regimes</h3>
            <p className="text-sm text-gray-600">Choose between old and new tax regimes based on your situation</p>
          </Card>
          
          <Card className="text-center p-6">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Stay Compliant</h3>
            <p className="text-sm text-gray-600">File returns on time and maintain proper documentation</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;
