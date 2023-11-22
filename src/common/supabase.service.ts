import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import BigNumber from 'bignumber.js';

import dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class SupabaseService {
  private supabase: any;

  constructor(private readonly logger: Logger) {}

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided!');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getProjectIds(): Promise<number[]> {
    const { data, error } = await this.supabase.rpc('read_project_data');
    if (error) {
      console.log('Error getting project ids', error);
      return [];
    }

    return data.map((project: any) => project.id);
  }

  async updateProjectScProgress(
    projectId: number,
    crowdfundedAmount: number,
    holdersCount: number,
  ): Promise<void> {
    const { error } = await this.supabase.rpc(
      'update_project_amount_and_holders',
      {
        _projectid: projectId,
        _amount: crowdfundedAmount,
        _holderscount: holdersCount,
      },
    );
    if (error) {
      console.log(
        `Error setting crowdfunded amount for projectId = ${projectId}`,
        error,
      );
    }
  }

  // async setCrowdfundedAmount(
  //   projectId: number,
  //   crowdfundedAmount: number,
  // ): Promise<void> {
  //   const { error } = await this.supabase
  //     .from('projects')
  //     .update({ crowdfundedAmount })
  //     .match({ id: projectId });
  //   if (error) {
  //     console.log(
  //       `Error setting crowdfunded amount for projectId = ${projectId}`,
  //       error,
  //     );
  //   }
  // }

  // async setHoldersCount(
  //   projectId: number,
  //   holdersCount: number,
  // ): Promise<void> {
  //   const { error } = await this.supabase
  //     .from('projects')
  //     .update({ holders: holdersCount })
  //     .match({ id: projectId });
  //   if (error) {
  //     console.log(
  //       `Error setting holders count for projectId = ${projectId}`,
  //       error,
  //     );
  //   }
  // }
}
