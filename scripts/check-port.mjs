// npm start 전에 포트가 비었는지 확인. ng serve 는 IPv4 에 다른 앱이 있어도 IPv6 로 같은 번호로 떠서 두 앱이 섞이므로 미리 막음
import net from 'node:net';

const port = Number(process.argv[2] ?? 5487);

function inUse(host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (e) => resolve(e.code === 'EADDRINUSE' || e.code === 'EACCES'));
    server.once('listening', () => server.close(() => resolve(false)));
    server.listen({ port, host, exclusive: true });
  });
}

const busy = [];
for (const host of ['127.0.0.1', '::1']) {
  if (await inUse(host)) busy.push(host);
}
if (busy.length > 0) {
  console.error(`포트 ${port} 을 다른 프로그램이 쓰고 있어요(${busy.join(', ')}). 그 프로그램을 끄고 다시 실행해 주세요.`);
  process.exit(1);
}
