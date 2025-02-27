import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GptVisionService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    try {
      // WSL 환경에서 Windows 경로를 읽기 위한 경로 변환
      const keyFilePath = '/mnt/c/Git/GPTkey.csv';
      console.log('API 키 파일 경로:', keyFilePath);

      const fileContent = fs.readFileSync(keyFilePath, 'utf-8');
      console.log('파일 내용 읽기 성공');
      
      // CSV 파일의 첫 번째 줄을 API 키로 사용
      const apiKey = fileContent.trim().split('\n')[0].trim();
      
      if (!apiKey) {
        throw new Error('API key not found in CSV file');
      }

      console.log('OpenAI API Key loaded successfully from CSV file');
      
      this.openai = new OpenAI({
        apiKey: apiKey
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw error;
    }
  }

  async analyzeImage(file: Express.Multer.File) {
    try {
      console.log('GPT Vision API 호출 시작');
      
      const base64Image = file.buffer.toString('base64');

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `이 음식 이미지를 분석하여 다음 JSON 형식으로 정보를 제공해주세요.
이미지에 여러 인분이 있는 경우 1인분을 기준으로 영양정보를 추정해주세요:
{
  "main_dish": "메인 요리명",
  "side_dishes": ["반찬1", "반찬2", ...],
  "type": "메인|국/찌개|밥|반찬|디저트|음료",
  "calories": 예상 총 칼로리 (숫자만),
  "nutrition": {
    "carbs": 총 탄수화물 (g),
    "protein": 총 단백질 (g),
    "fat": 총 지방 (g),
    "vitaminA": 총 비타민 A (mcg),
    "vitaminB": 총 비타민 B (mg),
    "vitaminC": 총 비타민 C (mg),
    "vitaminD": 총 비타민 D (mcg),
    "iron": 총 철분 (mg),
    "calcium": 총 칼슘 (mg),
    "fiber": 총 식이섬유 (g),
    "sodium": 총 나트륨 (mg)
  }
}

조건:
밥이 포함되어 있다면 반드시 "300kcal"를 추가합니다. (밥 한 공기 기준)
밥 포함 여부는 항상 확인하며, 이를 JSON의 "calories" 값에 반영하세요.
밥이 포함되지 않은 경우에는 다른 음식의 칼로리만 계산합니다.

주의:
오직 JSON 형식으로만 응답하세요.
분석 시 반드시 "밥"의 포함 여부를 확인하고, 칼로리 계산에 반영하세요.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.mimetype};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      console.log('GPT Vision API 응답 받음');
      let content = response.choices[0].message.content;
      console.log('원본 응답 내용:', content);

      // 응답 정제 과정 개선
      try {
        // 1. 마크다운 코드 블록 제거
        content = content.replace(/```json\n?|\n?```/g, '');
        
        // 2. 응답에서 첫 번째 '{' 부터 마지막 '}' 까지 추출
        const startIdx = content.indexOf('{');
        const endIdx = content.lastIndexOf('}') + 1;
        
        if (startIdx === -1 || endIdx === 0) {
          throw new Error('JSON 형식을 찾을 수 없습니다');
        }

        const jsonStr = content.slice(startIdx, endIdx);
        console.log('추출된 JSON 문자열:', jsonStr);

        // 3. JSON 파싱
        const parsedData = JSON.parse(jsonStr);
        console.log('파싱된 데이터:', parsedData);

        // 4. 기본값 설정 및 데이터 검증
        const defaultNutrition = {
          carbs: 0,
          protein: 0,
          fat: 0,
          vitaminA: 0,
          vitaminB: 0,
          vitaminC: 0,
          vitaminD: 0,
          iron: 0,
          calcium: 0,
          fiber: 0,
          sodium: 0
        };

        // 5. 응답 데이터 구조화
        const result = {
          main_dish: parsedData.main_dish || '알 수 없음',
          side_dishes: Array.isArray(parsedData.side_dishes) ? parsedData.side_dishes : [],
          type: parsedData.type || '메인',
          calories: Number(parsedData.calories) || 0,
          nutrition: {
            ...defaultNutrition,
            ...(parsedData.nutrition || {}),
          }
        };

        // 6. 데이터 유효성 최종 확인
        if (typeof result.main_dish !== 'string' || !Array.isArray(result.side_dishes)) {
          throw new Error('응답 데이터 형식이 올바르지 않습니다');
        }

        return result;

      } catch (parseError) {
        console.error('JSON 파싱 또는 데이터 처리 에러:', parseError);
        console.error('처리하려던 내용:', content);
        throw new Error(`응답 처리 중 오류: ${parseError.message}`);
      }
    } catch (error) {
      console.error('GPT Vision API Error:', error);
      throw error;
    }
  }
} 