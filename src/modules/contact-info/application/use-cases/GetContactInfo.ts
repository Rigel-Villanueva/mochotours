import type { ContactInfo } from '../../domain/entities/ContactInfo';
import type { ContactInfoRepository } from '../../domain/repositories/ContactInfoRepository';

export class GetContactInfo {
  constructor(private repository: ContactInfoRepository) {}

  async execute(): Promise<ContactInfo> {
    return await this.repository.getContactInfo();
  }
}
