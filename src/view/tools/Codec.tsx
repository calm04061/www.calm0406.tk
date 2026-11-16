import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {base64Decode, base64Encode, htmlDecode, htmlEncode, urlDecode, urlEncode} from '../../utils/codec';
import {copyText} from '../../utils/clipboard';

type CodecKind = 'base64' | 'url' | 'html';

const CODECS: Record<CodecKind, {
  label: string;
  encode: (input: string) => string;
  decode: (input: string) => string;
}> = {
  base64: {label: 'Base64', encode: base64Encode, decode: base64Decode},
  url: {label: 'URL', encode: urlEncode, decode: urlDecode},
  html: {label: 'HTML 实体', encode: htmlEncode, decode: htmlDecode},
};

const KIND_ORDER: CodecKind[] = ['base64', 'url', 'html'];

export default function Codec() {
  const [kind, setKind] = useState<CodecKind>('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = (direction: 'encode' | 'decode') => {
    try {
      setError('');
      setOutput(CODECS[kind][direction](input));
    } catch (err) {
      setOutput('');
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCopy = async () => {
    if (await copyText(output)) setCopied(true);
  };

  return (
    <Paper sx={{p: 3}}>
      <Typography variant="h5" gutterBottom>编解码</Typography>
      <Tabs
        value={kind}
        onChange={(_, value: CodecKind) => {
          setKind(value);
          setOutput('');
          setError('');
        }}
        sx={{mb: 2}}
      >
        {KIND_ORDER.map((key) => (
          <Tab key={key} value={key} label={CODECS[key].label}/>
        ))}
      </Tabs>
      <TextField
        label="输入"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        multiline
        minRows={5}
        fullWidth
      />
      <Box sx={{display: 'flex', gap: 1, my: 2}}>
        <Button variant="contained" onClick={() => run('encode')}>编码</Button>
        <Button variant="outlined" onClick={() => run('decode')}>解码</Button>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>清空</Button>
        <Box sx={{flexGrow: 1}}/>
        <Button onClick={handleCopy} disabled={!output}>复制结果</Button>
      </Box>
      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      <TextField
        label="输出"
        value={output}
        multiline
        minRows={5}
        fullWidth
        slotProps={{input: {readOnly: true}}}
      />
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => setCopied(false)}
        message="已复制到剪贴板"
      />
    </Paper>
  );
}
