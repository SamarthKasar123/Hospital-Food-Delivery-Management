import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryStatus } from '../types';
import { MealCard } from './MealCard';
import { DeliveryAssignment } from './DeliveryAssignment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function PantryDashboard() {
  const queryClient = useQueryClient();
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { data: meals, isLoading } = useQuery({
    queryKey: ['pantry-meals'],
    queryFn: async () => {
      const response = await fetch('/api/pantry/meals');
      return response.json();
    },
  });

  const updateMealStatus = useMutation({
    mutationFn: async ({ mealId, status }) => {
      const response = await fetch(`/api/pantry/meals/${mealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pantry-meals']);
    },
  });

  const assignDelivery = useMutation({
    mutationFn: async ({ mealId, deliveryPersonnelId }) => {
      const response = await fetch(`/api/pantry/meals/${mealId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryPersonnelId }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pantry-meals']);
      setSelectedMeal(null);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const mealsByStatus = {
    PENDING: meals?.filter(meal => meal.status === DeliveryStatus.PENDING) || [],
    PREPARING: meals?.filter(meal => meal.status === DeliveryStatus.PREPARING) || [],
    READY: meals?.filter(meal => meal.status === DeliveryStatus.READY) || [],
    IN_DELIVERY: meals?.filter(meal => meal.status === DeliveryStatus.IN_DELIVERY) || [],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inner Pantry Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mealsByStatus.PENDING.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onStatusUpdate={(status) => updateMealStatus.mutate({ mealId: meal.id, status })}
                  onAssign={() => setSelectedMeal(meal)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mealsByStatus.PREPARING.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onStatusUpdate={(status) => updateMealStatus.mutate({ mealId: meal.id, status })}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready for Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mealsByStatus.READY.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onStatusUpdate={(status) => updateMealStatus.mutate({ mealId: meal.id, status })}
                  onAssign={() => setSelectedMeal(meal)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mealsByStatus.IN_DELIVERY.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onStatusUpdate={(status) => updateMealStatus.mutate({ mealId: meal.id, status })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMeal && (
        <DeliveryAssignment
          meal={selectedMeal}
          onAssign={(deliveryPersonnelId) => 
            assignDelivery.mutate({ mealId: selectedMeal.id, deliveryPersonnelId })}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
}