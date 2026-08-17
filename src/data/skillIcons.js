import {
  SiPython,
  SiScikitlearn,
  SiTensorflow,
  SiPytorch,
  SiYolo,
  SiPandas,
  SiNumpy,
  SiJsonwebtokens,
  SiGit,
  SiGithub,
  SiJupyter,
} from 'react-icons/si'
import { FaAws, FaJava } from 'react-icons/fa6'
import {
  TbSql,
  TbBrain,
  TbLanguage,
  TbMessageChatbot,
  TbChartDots3,
  TbChartLine,
  TbChartAreaLine,
  TbChartHistogram,
  TbMathFunction,
  TbApi,
  TbNetwork,
} from 'react-icons/tb'

export const skillIcons = {
  Python: { icon: SiPython, color: '#3776AB' },
  Java: { icon: FaJava, color: '#f89820' },
  SQL: { icon: TbSql, color: 'var(--color-cyan)' },

  'scikit-learn': { icon: SiScikitlearn, color: '#F7931E' },
  TensorFlow: { icon: SiTensorflow, color: '#FF6F00' },
  PyTorch: { icon: SiPytorch, color: '#EE4C2C' },
  YOLOv8: { icon: SiYolo, color: 'var(--color-cyan)' },
  'Deep Learning': { icon: TbBrain, color: 'var(--color-violet)' },
  NLP: { icon: TbLanguage, color: 'var(--color-violet)' },
  'LLM APIs': { icon: TbMessageChatbot, color: 'var(--color-violet)' },
  'Predictive Modelling': { icon: TbChartDots3, color: 'var(--color-violet)' },

  Pandas: { icon: SiPandas, color: 'var(--color-text)' },
  NumPy: { icon: SiNumpy, color: 'var(--color-text)' },
  Matplotlib: { icon: TbChartLine, color: 'var(--color-magenta)' },
  Seaborn: { icon: TbChartAreaLine, color: 'var(--color-magenta)' },
  EDA: { icon: TbChartHistogram, color: 'var(--color-magenta)' },
  'Feature Engineering': { icon: TbMathFunction, color: 'var(--color-magenta)' },

  'AWS Lambda': { icon: FaAws, color: '#FF9900' },
  'API Gateway': { icon: TbApi, color: 'var(--color-cyan)' },
  'REST APIs': { icon: TbNetwork, color: 'var(--color-cyan)' },
  'JWT Auth': { icon: SiJsonwebtokens, color: 'var(--color-text)' },
  Git: { icon: SiGit, color: '#F05032' },
  GitHub: { icon: SiGithub, color: 'var(--color-text)' },
  Jupyter: { icon: SiJupyter, color: '#F37626' },
}
