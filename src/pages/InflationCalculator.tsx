import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingDown, Calculator, AlertTriangle } from 'lucide-react';

const InflationCalculator = () => {
  const [currentValue, setCurrentValue] = useState<number>(100000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [results, setResults] = useState<any>(null);

  const calculateInflation = () => {
    // Future Value = Present Value * (1 + inflation rate)^years
    const futureValue = currentValue * Math.pow(1 + inflationRate / 100, timePeriod);
    
    // Purchasing power loss
    const purchasingPowerLoss = futureValue - currentValue;
    
    // Real value of current amount in future
    const realValue = currentValue / Math.pow(1 + inflationRate / 100, timePeriod);
    
    // Amount needed to maintain same purchasing power
    const amountNeeded = futureValue;
    
    setResults({
      futureValue: Math.round(futureValue),
      purchasingPowerLoss: Math.round(purchasingPowerLoss),
      realValue: Math.round(realValue),
      amountNeeded: Math.round(amountNeeded),
      inflationMultiple: (futureValue / currentValue).toFixed(2)
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Inflation Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Understand how inflation affects your money's purchasing power over time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-red-600" />
                Inflation Impact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="current-value" className="text-base font-medium">
                  Current Amount/Value
                </Label>
                <Input
                  id="current-value"
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter current amount"
                />
                <p className="text-sm text-gray-500 mt-1">Amount or value in today's money</p>
              </div>

              <div>
                <Label htmlFor="inflation-rate" className="text-base font-medium">
                  Expected Annual Inflation Rate (%)
                </Label>
                <Input
                  id="inflation-rate"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="mt-2 text-lg"
                  step="0.1"
                  placeholder="Enter inflation rate"
                />
                <p className="text-sm text-gray-500 mt-1">India's average inflation: 4-7% annually</p>
              </div>

              <div>
                <Label htmlFor="time-period" className="text-base font-medium">
                  Time Period (Years)
                </Label>
                <Input
                  id="time-period"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="mt-2 text-lg"
                  placeholder="Enter years"
                />
                <p className="text-sm text-gray-500 mt-1">Number of years in the future</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Inflation Impact</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Inflation reduces the purchasing power of money over time. 
                      What costs ₹100 today will cost more in the future.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={calculateInflation}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg py-6"
              >
                Calculate Inflation Impact
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                  Inflation Impact Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600">Current Value</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(currentValue)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <p className="text-sm text-gray-600">Equivalent Future Cost</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(results.futureValue)}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      What {formatCurrency(currentValue)} will cost in {timePeriod} years
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600">Purchasing Power Loss</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(results.purchasingPowerLoss)}
                    </p>
                    <p className="text-xs text-orange-500 mt-1">
                      Additional amount needed due to inflation
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600">Real Value Today</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(results.realValue)}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      What {formatCurrency(currentValue)} will be worth in today's purchasing power
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Inflation Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Amount:</span>
                      <span className="font-medium">{formatCurrency(currentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inflation Rate:</span>
                      <span className="font-medium">{inflationRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Period:</span>
                      <span className="font-medium">{timePeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inflation Multiple:</span>
                      <span className="font-medium text-red-600">
                        {results.inflationMultiple}x
                      </span>
                    </div>
                    <div className="mt-3 p-2 bg-yellow-50 rounded">
                      <p className="text-xs text-yellow-800">
                        💡 <strong>Tip:</strong> Invest in instruments that beat inflation to preserve purchasing power!
                      </p>
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

export default InflationCalculator;