## Authentication

서버와 연결하기 위해서는 루트 디렉토리에 config/setup-env.sh 파일을 생성해야 합니다. 관리자한테 받으세요.

## Running a server

서버를 실행시킬 때는 `npm start`를 입력하면 `package.json`에 기재되어 있는 대로 client와 server 모두를 지켜보면서 변경이 있을때마다 다시 로드합니다.

이 때 클라이언트 코드를 묶기 위해 webpack을, 서버 코드를 트랜스파일링하기 위해서 babel-node를 사용합니다.

서버를 성공적으로 실행시키면 `Express server has started on port 3000; Connected to mysql as id ####`와 같은 메시지를 볼 수 있으며 `127.0.0.1:3000`으로 접속하면 됩니다.
