def foo(arg, **kwargs):
    print(**arg)


Dict = {"1": 'Geeks', "2": 'For', "3": 'Geeks'}

if __name__ == "__main__":
   foo(Dict)