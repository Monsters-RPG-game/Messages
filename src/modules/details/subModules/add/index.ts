import type AddMessageDetailsDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../repository/types.js';

export default class AddMessageDetailsController implements IAbstractSubController<string> {
  constructor(repo: IDetailsRepository) {
    this.repo = repo;
  }

  private accessor repo: IDetailsRepository;

  async execute(data: AddMessageDetailsDto): Promise<string> {
    const { message } = data;

    return this.repo.add({ message });
  }
}
