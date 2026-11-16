import {aesDecrypt, aesEncrypt, digestText} from './crypto';

describe('aes-gcm 加解密', () => {
  test('加密后用同一口令可以解密还原', async () => {
    const plain = '机密内容：hello 123 🔒';
    const cipher = await aesEncrypt(plain, 'correct horse battery staple');
    expect(cipher).not.toContain(plain);
    await expect(aesDecrypt(cipher, 'correct horse battery staple')).resolves.toBe(plain);
  });

  test('每次加密使用随机 salt/iv，密文不同', async () => {
    const a = await aesEncrypt('same', 'pw');
    const b = await aesEncrypt('same', 'pw');
    expect(a).not.toBe(b);
  });

  test('口令错误时解密失败', async () => {
    const cipher = await aesEncrypt('data', 'right');
    await expect(aesDecrypt(cipher, 'wrong')).rejects.toThrow();
  });

  test('密文格式非法时给出明确报错', async () => {
    await expect(aesDecrypt('aGk=', 'pw')).rejects.toThrow('密文格式不正确');
  });
});

describe('digestText', () => {
  test('SHA-256 已知向量', async () => {
    await expect(digestText('abc', 'SHA-256')).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });

  test('SHA-1 已知向量', async () => {
    await expect(digestText('abc', 'SHA-1')).resolves.toBe(
      'a9993e364706816aba3e25717850c26c9cd0d89d'
    );
  });
});
