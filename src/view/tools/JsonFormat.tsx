import React, {useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {formatJson, minifyJson, validateJson} from '../../utils/json';
import {copyText} from '../../utils/clipboard';

type Status = {severity: 'success' | 'error'; text: string} | null;

export default function JsonFormat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [copied, setCopied] = useState(false);

  const guard = (fn: () => string) => {
    try {
      setOutput(fn());
      setStatus({severity: 'success', text: 'JSON 有效'});
    } catch (err) {
      setOutput('');
      setStatus({severity: 'error', text: err instanceof Error ? err.message : String(err)});
    }
  };

  const handleValidate = () => {
    const result = validateJson(input);
    if (result.ok) {
      setStatus({severity: 'success', text: 'JSON 有效'});
    } else {
      const {message, line, column} = result.error;
      setStatus({
        severity: 'error',
        text: line !== undefined
          ? `${message}（第 ${line} 行，第 ${column} 列）`
          : message,
      });
    }
  };

  const handleCopy = async () => {
    if (await copyText(output || input)) setCopied(true);
  };

  return (
    <Paper sx={{p: 3}}>
      <Typography variant="h5" gutterBottom>JSON 格式化</Typography>
      <TextField
        label="输入 JSON"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        multiline
        minRows={8}
        fullWidth
        slotProps={{input: {sx: {fontFamily: 'monospace'}}}}
      />
      <Box sx={{display: 'flex', gap: 1, my: 2, flexWrap: 'wrap'}}>
        <Button variant="contained" onClick={() => guard(() => formatJson(input, 2))}>格式化</Button>
        <Button variant="outlined" onClick={() => guard(() => formatJson(input, 4))}>格式化（4 空格）</Button>
        <Button variant="outlined" onClick={() => guard(() => minifyJson(input))}>压缩</Button>
        <Button onClick={handleValidate}>校验</Button>
        <Button onClick={() => { setInput(''); setOutput(''); setStatus(null); }}>清空</Button>
        <Box sx={{flexGrow: 1}}/>
        <Button disabled={!output && !input} onClick={handleCopy}>复制</Button>
      </Box>
      {status && <Alert severity={status.severity} sx={{mb: 2}}>{status.text}</Alert>}
      <TextField
        label="输出"
        value={output}
        multiline
        minRows={8}
        fullWidth
        slotProps={{input: {readOnly: true, sx: {fontFamily: 'monospace'}}}}
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
