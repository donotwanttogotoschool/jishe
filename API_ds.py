import ast
import pickle

aaa = """
# print("123321")
print("Evil Code!!")
"""
a1 = ast.parse(aaa, mode='exec')
exec(compile(a1, filename="<string>", mode="exec"))

print("————————Split————————")
class A(object):
    def __reduce__(self):
        return (exec, (aaa,))


ret = pickle.dumps(A())
pickle.loads(ret)
