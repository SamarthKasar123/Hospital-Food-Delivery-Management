import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliveryNotes } from './DeliveryNotes';

export default function DeliveryDashboard() {
  const queryClient = useQueryClient();
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['assigned-deliveries'],
    queryFn: async () => {
      const response = await fetch('/api/delivery/assigned');
      return response.json();
    },
  });

  const markDelivered = useMutation({
    mutationFn: async ({ deliveryId, notes }) => {
      const response = await fetch(`/api/delivery/${deliveryId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assigned-deliveries']);
      setSelectedDelivery(null);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Delivery Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliveries?.map(delivery => (
          <Card key={delivery.id}>
            <CardHeader>
              <CardTitle>Delivery #{delivery.id.slice(-6)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Patient:</strong> {delivery.meal.dietChart.patient.name}</p>
                <p><strong>Room:</strong> {delivery.meal.dietChart.patient.roomNumber}</p>
                <p><strong>Floor:</strong> {delivery.meal.dietChart.patient.floorNumber}</p>
                <p><strong>Meal Time:</strong> {delivery.meal.mealTime}</p>
                <p><strong>Special Instructions:</strong></p>
                <ul className="list-disc pl-4">
                  {delivery.meal.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
                
                <div className="pt-4">
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    Mark as Delivered
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDelivery && (
        <DeliveryNotes
          delivery={selectedDelivery}
          onSubmit={(notes) => markDelivered.mutate({ 
            deliveryId: selectedDelivery.id, 
            notes 
          })}
          onClose={() => setSelectedDelivery(null)}
        />
      )}
    </div>
  );
}