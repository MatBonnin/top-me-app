export interface Friendship {
  id: string;
  requester: any;
  addressee: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
