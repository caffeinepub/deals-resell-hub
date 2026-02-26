import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, OrderStatus, type Listing, type Order } from '../backend';

// ─── Listings ────────────────────────────────────────────────────────────────

export function useActiveListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ['activeListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListings();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAllListings() {
  const { actor, isFetching } = useActor();
  return useQuery<Listing[]>({
    queryKey: ['allListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListing(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Listing | null>({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string; title: string; description: string;
      originalPrice: number; dealPrice: number; category: Category;
      imageUrl: string; stockQuantity: bigint; expiryTimestamp: bigint | null;
      pin: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createListing(
        params.id, params.title, params.description,
        params.originalPrice, params.dealPrice, params.category,
        params.imageUrl, params.stockQuantity, params.expiryTimestamp, params.pin
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allListings'] });
      qc.invalidateQueries({ queryKey: ['activeListings'] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string; title: string; description: string;
      originalPrice: number; dealPrice: number; category: Category;
      imageUrl: string; stockQuantity: bigint; expiryTimestamp: bigint | null;
      pin: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateListing(
        params.id, params.title, params.description,
        params.originalPrice, params.dealPrice, params.category,
        params.imageUrl, params.stockQuantity, params.expiryTimestamp, params.pin
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['allListings'] });
      qc.invalidateQueries({ queryKey: ['activeListings'] });
      qc.invalidateQueries({ queryKey: ['listing', vars.id] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pin }: { id: string; pin: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteListing(id, pin);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allListings'] });
      qc.invalidateQueries({ queryKey: ['activeListings'] });
    },
  });
}

export function useToggleListingActive() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pin }: { id: string; pin: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.toggleListingActive(id, pin);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allListings'] });
      qc.invalidateQueries({ queryKey: ['activeListings'] });
    },
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string; listingId: string; customerName: string;
      customerPhone: string; customerAddress: string;
      quantity: bigint; timestamp: bigint;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.placeOrder(
        params.id, params.listingId, params.customerName,
        params.customerPhone, params.customerAddress,
        params.quantity, params.timestamp
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activeListings'] });
    },
  });
}

export function useAllOrders(pin: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['allOrders', pin],
    queryFn: async () => {
      if (!actor || !pin) return [];
      return actor.getAllOrders(pin);
    },
    enabled: !!actor && !isFetching && !!pin,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, newStatus, pin }: { orderId: string; newStatus: OrderStatus; pin: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateOrderStatus(orderId, newStatus, pin);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['allOrders', vars.pin] });
    },
  });
}
