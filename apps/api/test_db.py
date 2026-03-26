import asyncio
import asyncpg

async def test():
    try:
        conn = await asyncpg.connect('postgresql://grievances:grievances@127.0.0.1:5432/grievances')
        print('SUCCESS: Connected to database')
        await conn.close()
    except Exception as e:
        print(f'ERROR: {e}')

if __name__ == "__main__":
    asyncio.run(test())
