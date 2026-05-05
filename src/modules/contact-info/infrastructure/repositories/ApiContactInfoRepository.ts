import type { ContactInfo } from '../../domain/entities/ContactInfo';
import type { ContactInfoRepository } from '../../domain/repositories/ContactInfoRepository';
import { apiClient } from '@/shared/api/apiClient';

export class ApiContactInfoRepository implements ContactInfoRepository {
  async getContactInfo(): Promise<ContactInfo> {
    const res = await apiClient.get<{ success: boolean; data: ContactInfo }>('/api/contact-info');
    return res.data;
  }

  async updateContactInfo(data: ContactInfo): Promise<ContactInfo> {
    const res = await apiClient.post<{ success: boolean; data: ContactInfo }>('/api/contact-info', data as Record<string, unknown>);
    return res.data;
  }
}
