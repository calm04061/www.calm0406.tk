import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {aesDecrypt, aesEncrypt, digestText, HASH_ALGORITHMS, HashAlgorithm} from '../../utils/crypto';
import {copyText} from '../../utils/clipboard';

function AesPanel() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async (direction: 'encrypt' | 'decrypt') => {
    if (!password) {
      setError('请输入口令');
      return;
    }
    setBusy(true);
    setError('');
    try {
      setOutput(
        direction === 'encrypt'
          ? await aesEncrypt(input, password)
          : await aesDecrypt(input, password)
      );
    } catch {
      setOutput('');
      setError(direction === 'decrypt' ? '解密失败：口令错误或密文不完整' : '加密失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <TextField
        label="口令"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
        sx={{mb: 2}}
        helperText="使用 PBKDF2 派生 AES-GCM 256 位密钥，加解密均在浏览器本地完成"
      />
      <TextField
        label="输入（明文或密文）"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        multiline
        minRows={4}
        fullWidth
      />
      <Box sx={{display: 'flex', gap: 1, my: 2}}>
        <Button variant="contained" disabled={busy} onClick={() => run('encrypt')}>加密</Button>
        <Button variant="outlined" disabled={busy} onClick={() => run('decrypt')}>解密</Button>
        <Button onClick={() => { setInput(''); setOutput(''); setError(''); }}>清空</Button>
        <Box sx={{flexGrow: 1}}/>
        <Button
          disabled={!output}
          onClick={async () => { if (await copyText(output)) setCopied(true); }}
        >
          复制结果
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      <TextField
        label="输出"
        value={output}
        multiline
        minRows={4}
        fullWidth
        slotProps={{input: {readOnly: true}}}
      />
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => setCopied(false)}
        message="已复制到剪贴板"
      />
    </Box>
  );
}

function HashPanel() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setError('');
    try {
      setOutput(await digestText(input, algorithm));
    } catch (err) {
      setOutput('');
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Box>
      <FormControl sx={{mb: 2, minWidth: 200}}>
        <InputLabel id="hash-algorithm-label">算法</InputLabel>
        <Select
          labelId="hash-algorithm-label"
          label="算法"
          value={algorithm}
          onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}
        >
          {HASH_ALGORITHMS.map((algo) => (
            <MenuItem key={algo} value={algo}>{algo}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="输入"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        multiline
        minRows={4}
        fullWidth
      />
      <Box sx={{display: 'flex', gap: 1, my: 2}}>
        <Button variant="contained" onClick={run}>计算摘要</Button>
        <Box sx={{flexGrow: 1}}/>
        <Button
          disabled={!output}
          onClick={async () => { if (await copyText(output)) setCopied(true); }}
        >
          复制结果
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      <TextField
        label="摘要（hex）"
        value={output}
        fullWidth
        slotProps={{input: {readOnly: true}}}
      />
      <Snackbar
        open={copied}
        autoHideDuration={1500}
        onClose={() => setCopied(false)}
        message="已复制到剪贴板"
      />
    </Box>
  );
}

export default function CryptoTool() {
  const [tab, setTab] = useState<'aes' | 'hash'>('aes');

  return (
    <Paper sx={{p: 3}}>
      <Typography variant="h5" gutterBottom>加解密</Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{mb: 2}}>
        <Tab value="aes" label="AES 加解密"/>
        <Tab value="hash" label="哈希摘要"/>
      </Tabs>
      {tab === 'aes' ? <AesPanel/> : <HashPanel/>}
    </Paper>
  );
}
