import { readFileSync } from 'fs';
import { join } from 'path';

export default () => {
  const openaiKeyPath = process.env.OPENAI_API_KEY_PATH || '/mnt/c/git/GPTkey.csv';
  let openaiKey = '';
  
  try {
    openaiKey = readFileSync(openaiKeyPath, 'utf8').trim();
    
    // CSV 형식이라면 콤마로 구분된 첫 번째 값을 사용
    if (openaiKey.includes(',')) {
      openaiKey = openaiKey.split(',')[0].trim();
    }
    
    // 키가 유효한지 확인
    if (!openaiKey.startsWith('sk-')) {
      console.warn('Warning: OpenAI API key format might be invalid');
    }
  } catch (error) {
    console.error('OpenAI API 키 파일을 읽을 수 없습니다:', error);
    // 환경 변수에서 직접 키를 읽어보기
    openaiKey = process.env.OPENAI_API_KEY || '';
  }

  if (!openaiKey) {
    console.error('OpenAI API 키를 찾을 수 없습니다. 환경 변수나 파일에서 키를 설정해주세요.');
  }

  return {
    openai: {
      apiKey: openaiKey,
    }
  };
}; 