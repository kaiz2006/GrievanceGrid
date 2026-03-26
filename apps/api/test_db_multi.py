import asyncio
import asyncpg

async def test_conn(url):
    try:
        conn = await asyncpg.connect(url)
        print(f'SUCCESS: {url}')
        await conn.close()
        return True
    except Exception as e:
        print(f'FAIL: {url} -> {e}')
        return False

async def main():
    urls = [
        'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
        'postgresql://postgres@127.0.0.1:5432/postgres',
        'postgresql://postgres:password@127.0.0.1:5432/postgres',
        'postgresql://grievances:grievances@127.0.0.1:5432/grievances'
    ]
    for url in urls:
        if await test_conn(url):
            break

if __name__ == "__main__":
    asyncio.run(main())
