import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function DietChartForm({ onClose, patientId }) {
    const queryClient = useQueryClient();
    const [meals, setMeals] = useState([
      { mealTime: 'MORNING', ingredients: '', instructions: '' },
      { mealTime: 'EVENING', ingredients: '', instructions: '' },
      { mealTime: 'NIGHT', ingredients: '', instructions: '' },
    ]);
  
    const createDietChart = useMutation({
      mutationFn: async (data) => {
        const response = await fetch('/api/diet-charts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId,
            date: new Date(),
            meals: meals.map(meal => ({
              ...meal,
              ingredients: meal.ingredients.split(',').map(i => i.trim()),
              instructions: meal.instructions.split(',').map(i => i.trim()),
            })),
          }),
        });
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['diet-charts']);
        onClose();
      },
    });
  
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Diet Chart</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createDietChart.mutate();
          }} className="space-y-6">
            {meals.map((meal, index) => (
              <div key={meal.mealTime} className="space-y-4">
                <h3 className="font-medium">{meal.mealTime} Meal</h3>
                <Input
                  placeholder="Ingredients (comma-separated)"
                  value={meal.ingredients}
                  onChange={(e) => {
                    const newMeals = [...meals];
                    newMeals[index].ingredients = e.target.value;
                    setMeals(newMeals);
                  }}
                />
                <Input
                  placeholder="Instructions (comma-separated)"
                  value={meal.instructions}
                  onChange={(e) => {
                    const newMeals = [...meals];
                    newMeals[index].instructions = e.target.value;
                    setMeals(newMeals);
                  }}
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Create Diet Chart
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }