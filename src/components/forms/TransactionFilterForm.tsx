import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionFilterFormProps {
  onFilter: (filters: { 
    search: string;
    type: string;
    category: string;
    dateRange: string;
  }) => void;
}

export function TransactionFilterForm({ onFilter }: TransactionFilterFormProps) {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateRange: 'all',
  });
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch unique categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/transactions/categories');
        if (response.ok) {
          const data = await response.json();
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map((item: { name: string }) => item.name))
          ) as string[];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories
        setCategories(['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Income']);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: 'all',
      category: 'all',
      dateRange: 'all',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            name="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={filters.search}
            onChange={handleInputChange}
          />
        </div>
        
        <Select
          value={filters.type}
          onValueChange={(value) => handleSelectChange('type', value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Transaction Type</SelectLabel>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.dateRange}
          onValueChange={(value) => handleSelectChange('dateRange', value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Date Range</SelectLabel>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button type="submit">Filter</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
} 