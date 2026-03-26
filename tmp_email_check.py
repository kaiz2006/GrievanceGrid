from pydantic import BaseModel, EmailStr, ValidationError

class M(BaseModel):
    email: EmailStr

for t in ['citizen1227@grievancegrid.local', 'citizen1227@example.com']:
    try:
        M(email=t)
        print(t, '=> OK')
    except ValidationError as e:
        print(t, '=> FAIL', e.errors())
