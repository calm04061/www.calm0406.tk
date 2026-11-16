import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {formatDate, parseTimestamp, timestampOf} from '../../utils/time';

const TIMEZONES: { value: string; label: string }[] = [
  {value: 'local', label: '本地时区'},
  {value: 'UTC', label: 'UTC'},
  {value: 'Asia/Shanghai', label: 'Asia/Shanghai（北京）'},
  {value: 'Asia/Tokyo', label: 'Asia/Tokyo（东京）'},
  {value: 'Asia/Singapore', label: 'Asia/Singapore（新加坡）'},
  {value: 'Europe/London', label: 'Europe/London（伦敦）'},
  {value: 'Europe/Berlin', label: 'Europe/Berlin（柏林）'},
  {value: 'America/New_York', label: 'America/New_York（纽约）'},
  {value: 'America/Los_Angeles', label: 'America/Los_Angeles（洛杉矶）'},
];

function CurrentTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const {s, ms} = timestampOf(now);

  return (
    <Box sx={{mb: 4}}>
      <Typography variant="h6" gutterBottom>当前时间</Typography>
      <Table size="small">
        <TableBody>
          <TableRow><TableCell sx={{width: 160}}>Unix 时间戳（秒）</TableCell><TableCell>{s}</TableCell></TableRow>
          <TableRow><TableCell>Unix 时间戳（毫秒）</TableCell><TableCell>{ms}</TableCell></TableRow>
          <TableRow><TableCell>本地时间</TableCell><TableCell>{formatDate(now)}</TableCell></TableRow>
          <TableRow><TableCell>UTC</TableCell><TableCell>{formatDate(now, 'UTC')}</TableCell></TableRow>
          <TableRow><TableCell>ISO 8601</TableCell><TableCell>{now.toISOString()}</TableCell></TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

function TimestampToDate() {
  const [input, setInput] = useState('');
  const [timeZone, setTimeZone] = useState('local');

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return {parsed: parseTimestamp(input), error: ''};
    } catch (err) {
      return {parsed: null, error: err instanceof Error ? err.message : String(err)};
    }
  }, [input]);

  return (
    <Box sx={{mb: 4}}>
      <Typography variant="h6" gutterBottom>时间戳 → 日期时间</Typography>
      <Box sx={{display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'}}>
        <TextField
          label="时间戳（自动识别秒/毫秒）"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          sx={{minWidth: 280}}
        />
        <FormControl sx={{minWidth: 240}}>
          <InputLabel id="tz-select-label">时区</InputLabel>
          <Select
            labelId="tz-select-label"
            label="时区"
            value={timeZone}
            onChange={(event) => setTimeZone(event.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {result?.error && <Alert severity="error" sx={{mb: 2}}>{result.error}</Alert>}
      {result?.parsed && (
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{width: 160}}>识别单位</TableCell>
              <TableCell>{result.parsed.unit === 's' ? '秒' : '毫秒'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{timeZone === 'local' ? '本地时间' : timeZone}</TableCell>
              <TableCell>
                {formatDate(result.parsed.date, timeZone === 'local' ? undefined : timeZone)}
              </TableCell>
            </TableRow>
            <TableRow><TableCell>UTC</TableCell><TableCell>{formatDate(result.parsed.date, 'UTC')}</TableCell></TableRow>
            <TableRow><TableCell>ISO 8601</TableCell><TableCell>{result.parsed.date.toISOString()}</TableCell></TableRow>
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

function DateToTimestamp() {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    if (!input) return null;
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return {error: '无法解析该日期时间', ts: null};
    return {error: '', ts: timestampOf(date)};
  }, [input]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>日期时间 → 时间戳</Typography>
      <Box sx={{display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'}}>
        <TextField
          label="日期时间（本地时区）"
          type="datetime-local"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          slotProps={{inputLabel: {shrink: true}}}
          sx={{minWidth: 280}}
        />
        <Button variant="outlined" onClick={() => {
          const now = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          setInput(
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
            `T${pad(now.getHours())}:${pad(now.getMinutes())}`
          );
        }}>
          填入现在
        </Button>
      </Box>
      {result?.error && <Alert severity="error" sx={{mb: 2}}>{result.error}</Alert>}
      {result?.ts && (
        <Table size="small">
          <TableBody>
            <TableRow><TableCell sx={{width: 160}}>Unix 时间戳（秒）</TableCell><TableCell>{result.ts.s}</TableCell></TableRow>
            <TableRow><TableCell>Unix 时间戳（毫秒）</TableCell><TableCell>{result.ts.ms}</TableCell></TableRow>
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

export default function TimeConvert() {
  return (
    <Paper sx={{p: 3}}>
      <Typography variant="h5" gutterBottom>时间转换</Typography>
      <CurrentTime/>
      <TimestampToDate/>
      <DateToTimestamp/>
    </Paper>
  );
}
