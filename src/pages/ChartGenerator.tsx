
import { useState } from "react";
import { BarChart3, ArrowLeft, Download, Copy, RotateCcw, Upload, Palette, Grid, Type, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
}

type ChartType = 'bar' | 'horizontalBar' | 'line' | 'pie' | 'area' | 'scatter';

const ChartGenerator = () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [data, setData] = useState<DataPoint[]>([
    { id: '1', label: 'Category A', value: 30, color: '#8884d8' },
    { id: '2', label: 'Category B', value: 80, color: '#82ca9d' },
    { id: '3', label: 'Category C', value: 45, color: '#ffc658' },
    { id: '4', label: 'Category D', value: 60, color: '#ff7300' }
  ]);
  const [chartTitle, setChartTitle] = useState('My Chart');
  const [xAxisLabel, setXAxisLabel] = useState('Categories');
  const [yAxisLabel, setYAxisLabel] = useState('Values');
  const [showGrid, setShowGrid] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'horizontalBar', name: 'Horizontal Bar', icon: BarChart3 },
    { id: 'line', name: 'Line Chart', icon: BarChart3 },
    { id: 'pie', name: 'Pie Chart', icon: BarChart3 },
    { id: 'area', name: 'Area Chart', icon: BarChart3 },
    { id: 'scatter', name: 'Scatter Plot', icon: BarChart3 }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

  const addDataPoint = () => {
    const newId = (data.length + 1).toString();
    setData([...data, { 
      id: newId, 
      label: `Category ${String.fromCharCode(65 + data.length)}`, 
      value: 0, 
      color: colors[data.length % colors.length] 
    }]);
  };

  const removeDataPoint = (id: string) => {
    setData(data.filter(point => point.id !== id));
  };

  const updateDataPoint = (id: string, field: keyof DataPoint, value: string | number) => {
    setData(data.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  const loadSampleData = () => {
    const sampleData = [
      { id: '1', label: 'Q1', value: 120, color: '#8884d8' },
      { id: '2', label: 'Q2', value: 180, color: '#82ca9d' },
      { id: '3', label: 'Q3', value: 150, color: '#ffc658' },
      { id: '4', label: 'Q4', value: 200, color: '#ff7300' }
    ];
    setData(sampleData);
    setChartTitle('Quarterly Sales Report');
    setXAxisLabel('Quarters');
    setYAxisLabel('Sales ($000s)');
    toast({
      title: "Sample Data Loaded",
      description: "Sample quarterly sales data has been loaded.",
    });
  };

  const resetChart = () => {
    setData([
      { id: '1', label: 'Category A', value: 30, color: '#8884d8' },
      { id: '2', label: 'Category B', value: 80, color: '#82ca9d' },
      { id: '3', label: 'Category C', value: 45, color: '#ffc658' },
      { id: '4', label: 'Category D', value: 60, color: '#ff7300' }
    ]);
    setChartTitle('My Chart');
    setXAxisLabel('Categories');
    setYAxisLabel('Values');
    setShowGrid(true);
    setShowDataLabels(false);
    setFontSize(12);
    toast({
      title: "Chart Reset",
      description: "Chart has been reset to default values.",
    });
  };

  const parseCsvData = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const newData: DataPoint[] = [];
    
    lines.forEach((line, index) => {
      const [label, value] = line.split(',');
      if (label && value && !isNaN(Number(value))) {
        newData.push({
          id: (index + 1).toString(),
          label: label.trim(),
          value: Number(value.trim()),
          color: colors[index % colors.length]
        });
      }
    });
    
    if (newData.length > 0) {
      setData(newData);
      toast({
        title: "CSV Data Imported",
        description: `${newData.length} data points imported successfully.`,
      });
    } else {
      toast({
        title: "Import Failed",
        description: "Invalid CSV format. Use: Label,Value format.",
        variant: "destructive",
      });
    }
  };

  const exportAsCSV = () => {
    const csvContent = data.map(point => `${point.label},${point.value}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartTitle.replace(/\s+/g, '_')}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "CSV Exported",
      description: "Chart data exported as CSV file.",
    });
  };

  const exportChart = (format: 'svg' | 'png') => {
    const chartElement = document.querySelector('.recharts-wrapper');
    if (!chartElement) return;

    if (format === 'svg') {
      const svgElement = chartElement.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chartTitle.replace(/\s+/g, '_')}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Chart Exported",
          description: "Chart exported as SVG file.",
        });
      }
    }
  };

  const copyToClipboard = () => {
    const chartData = JSON.stringify({ title: chartTitle, data, type: chartType });
    navigator.clipboard.writeText(chartData);
    toast({
      title: "Chart Copied",
      description: "Chart configuration copied to clipboard.",
    });
  };

  const renderChart = () => {
    const chartConfig = {
      value: { label: yAxisLabel, color: "#8884d8" }
    };

    const commonProps = {
      data: data.map(d => ({ name: d.label, value: d.value, fill: d.color })),
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={fontSize} />
              <YAxis fontSize={fontSize} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" />
            </BarChart>
          </ChartContainer>
        );
      
      case 'horizontalBar':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <BarChart {...commonProps} layout="horizontal">
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" fontSize={fontSize} />
              <YAxis dataKey="name" type="category" fontSize={fontSize} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" />
            </BarChart>
          </ChartContainer>
        );
      
      case 'line':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={fontSize} />
              <YAxis fontSize={fontSize} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        );
      
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <PieChart>
              <Pie
                data={commonProps.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={showDataLabels ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {commonProps.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );
      
      case 'area':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={fontSize} />
              <YAxis fontSize={fontSize} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ChartContainer>
        );
      
      case 'scatter':
        return (
          <ChartContainer config={chartConfig} className="h-96">
            <ScatterChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" fontSize={fontSize} />
              <YAxis fontSize={fontSize} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter dataKey="value" fill="#8884d8" />
            </ScatterChart>
          </ChartContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-cyan-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className={`inline-flex items-center mb-6 transition-colors ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-800'}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-teal-800' : 'bg-teal-100'}`}>
              <BarChart3 className={`h-8 w-8 ${isDarkMode ? 'text-teal-300' : 'text-teal-600'}`} />
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chart Generator</h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Create beautiful charts and graphs with customizable options</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Data Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Type className="mr-2 h-5 w-5" />
                      Chart Settings
                    </span>
                    <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline" size="sm">
                      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="chartTitle">Chart Title</Label>
                    <Input
                      id="chartTitle"
                      value={chartTitle}
                      onChange={(e) => setChartTitle(e.target.value)}
                      placeholder="Enter chart title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="xAxisLabel">X-Axis Label</Label>
                      <Input
                        id="xAxisLabel"
                        value={xAxisLabel}
                        onChange={(e) => setXAxisLabel(e.target.value)}
                        placeholder="X-axis"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
                      <Input
                        id="yAxisLabel"
                        value={yAxisLabel}
                        onChange={(e) => setYAxisLabel(e.target.value)}
                        placeholder="Y-axis"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Chart Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {chartTypes.map((type) => (
                        <Button
                          key={type.id}
                          variant={chartType === type.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setChartType(type.id as ChartType)}
                          className="text-xs"
                        >
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Grid</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showDataLabels}
                        onChange={(e) => setShowDataLabels(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Data Labels</span>
                    </label>
                  </div>

                  <div>
                    <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                    <input
                      type="range"
                      id="fontSize"
                      min="8"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={loadSampleData} variant="outline" size="sm" className="flex-1">
                      Sample Data
                    </Button>
                    <Button onClick={resetChart} variant="outline" size="sm" className="flex-1">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                <CardHeader>
                  <CardTitle>Data Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.map((point, index) => (
                    <div key={point.id} className="flex items-center space-x-2">
                      <Input
                        value={point.label}
                        onChange={(e) => updateDataPoint(point.id, 'label', e.target.value)}
                        placeholder="Label"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={point.value}
                        onChange={(e) => updateDataPoint(point.id, 'value', Number(e.target.value))}
                        placeholder="Value"
                        className="w-20"
                      />
                      <input
                        type="color"
                        value={point.color}
                        onChange={(e) => updateDataPoint(point.id, 'color', e.target.value)}
                        className="w-8 h-8 border rounded"
                      />
                      <Button
                        onClick={() => removeDataPoint(point.id)}
                        variant="outline"
                        size="sm"
                        disabled={data.length <= 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addDataPoint} variant="outline" className="w-full">
                    Add Data Point
                  </Button>
                </CardContent>
              </Card>

              <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                <CardHeader>
                  <CardTitle>Import/Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="csvInput">Paste CSV Data (Label,Value)</Label>
                    <textarea
                      id="csvInput"
                      placeholder="Category A,30&#10;Category B,80&#10;Category C,45"
                      className={`w-full h-20 p-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          parseCsvData(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <Button onClick={exportAsCSV} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data as CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Chart Preview Section */}
            <div className="lg:col-span-2">
              <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{chartTitle}</span>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => exportChart('svg')} variant="outline" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        SVG
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    {renderChart()}
                  </div>
                </CardContent>
              </Card>

              <Card className={`shadow-xl border-0 mt-6 ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Quick Start:</h3>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>• Enter your data in the data points section</li>
                        <li>• Choose your preferred chart type</li>
                        <li>• Customize colors and labels</li>
                        <li>• Export as SVG or copy to clipboard</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Features:</h3>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>• 6 different chart types</li>
                        <li>• CSV import/export support</li>
                        <li>• Real-time preview</li>
                        <li>• Dark/Light mode toggle</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartGenerator;
