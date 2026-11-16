import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardActions, CardContent, Button, Typography} from '@mui/material';

const TOOLS = [
  {
    path: '/tools/codec',
    title: '编解码',
    description: 'Base64 / URL / HTML 实体的编码与解码，支持中文等 UTF-8 内容。',
  },
  {
    path: '/tools/crypto',
    title: '加解密',
    description: 'AES-GCM 口令加解密与 SHA 系列哈希摘要，全部在浏览器本地完成。',
  },
  {
    path: '/tools/time',
    title: '时间转换',
    description: 'Unix 时间戳与日期时间互转，自动识别秒/毫秒，支持多时区。',
  },
  {
    path: '/tools/json',
    title: 'JSON 格式化',
    description: 'JSON 格式化、压缩与校验，错误信息定位到行列。',
  },
];

export default function Home() {
  return (
    <Box sx={{py: 2}}>
      <Typography variant="h4" gutterBottom>工具箱</Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        }}
      >
        {TOOLS.map((tool) => (
          <Card key={tool.path} sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1}}>
              <Typography variant="h6" gutterBottom>{tool.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {tool.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to={tool.path} size="small">
                打开
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
