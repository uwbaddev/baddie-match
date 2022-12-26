from app.model.category_model import CategoryModel

class CategoryService():
  model = None

  def __init__(self):
    self.model = CategoryModel()

  def findById(self, id):
    try: 
      category = self.model.findById(id)
    except Exception as e:
      return(str(e), 500)
    
    return(category, 500)


  def delete(self, id):
    try: 
      self.model.delete(id)
    except Exception as e:
      return(str(e), 500)

  def update(self, id, name):
      self.validate(id)
      self.validate(name)

      self.model.update(id, name)
      return 'success', 201
  
  def validate(self, data):
    if data is None: 
      # Todo make exception class
      raise Exception('Null Arg')


  def handle(self, request):
    



  def serialize(self):
    return {
        'id': self.id,
        'name': self.name
    }
