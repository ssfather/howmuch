import { Controller, Get, Post, Body } from '@nestjs/common';
import { NutritionAnalysisService } from '../services/nutrition-analysis.service';
import { NutritionAnalysis, UserInfo } from '../services/nutrition-analysis.service';

@Controller('nutrition')
export class NutritionController {
  constructor(private nutritionAnalysisService: NutritionAnalysisService) {}

  @Post('analyze')
  async analyzeNutrition(
    @Body('meals') meals: any[],
    @Body('userInfo') userInfo: UserInfo
  ): Promise<NutritionAnalysis> {
    return this.nutritionAnalysisService.analyzeNutrition(meals, userInfo);
  }
} 