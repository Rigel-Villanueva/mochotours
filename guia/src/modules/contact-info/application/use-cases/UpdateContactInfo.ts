import type { ContactInfo } from '../../domain/entities/ContactInfo';
import type { ContactInfoRepository } from '../../domain/repositories/ContactInfoRepository';

export class UpdateContactInfo {
  constructor(private repository: ContactInfoRepository) {}

  async execute(data: ContactInfo): Promise<ContactInfo> {
    return await this.repository.updateContactInfo(data);
  }
}
