export const listListsSchema = {
    tags: ['lists'],
    summary: 'Lister toutes les TodoLists',
    description: 'Cette route retourne toutes les TodoLists.',
    response: {
      200: {
        description: 'Réponse réussie',
        type: 'array',
        items: {
          $ref: 'ITodoList#'
        }
      }
    }
  };
  
  export const addListSchema = {
    tags: ['lists'],
    summary: 'Ajouter une nouvelle TodoList',
    description: 'Cette route permet d\'ajouter une nouvelle TodoList.',
    body: {
      $ref: 'ITodoList#'
    },
    response: {
      201: {
        description: 'TodoList créée avec succès',
        $ref: 'ITodoList#'
      }
    }
  };
  
  export const updateListSchema = {
    tags: ['lists'],
    summary: 'Mettre à jour une TodoList',
    description: 'Cette route permet de mettre à jour une TodoList.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la TodoList à mettre à jour' }
      },
      required: ['id']
    },
    body: {
      $ref: 'ITodoList#'
    },
    response: {
      200: {
        description: 'TodoList mise à jour avec succès',
        $ref: 'ITodoList#'
      }
    }
  };
  
  export const deleteListSchema = {
    tags: ['lists'],
    summary: 'Supprimer une TodoList',
    description: 'Cette route permet de supprimer une TodoList.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la TodoList à supprimer' }
      },
      required: ['id']
    },
    response: {
      204: {
        description: 'TodoList supprimée avec succès'
      }
    }
  };
  
  export const addItemToListSchema = {
    tags: ['items'],
    summary: 'Ajouter un item à une TodoList',
    description: 'Cette route permet d\'ajouter un nouvel item à une TodoList.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la liste' }
      },
      required: ['id']
    },
    body: {
      $ref: 'ITodoItem#'
    },
    response: {
      201: {
        description: 'Item ajouté avec succès',
        $ref: 'ITodoItem#'
      }
    }
  };
  
  export const removeItemFromListSchema = {
    tags: ['items'],
    summary: 'Supprimer un item d\'une TodoList',
    description: 'Cette route permet de supprimer un item d\'une TodoList.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la liste' },
        itemId: { type: 'string', description: 'ID de l\'item à supprimer' }
      },
      required: ['id', 'itemId']
    },
    response: {
      204: {
        description: 'Item supprimé avec succès'
      }
    }
  };
  
  export const updateItemInListSchema = {
    tags: ['items'],
    summary: 'Mettre à jour un item dans une TodoList',
    description: 'Cette route permet de mettre à jour un item dans une TodoList.',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID de la liste' },
        itemId: { type: 'string', description: 'ID de l\'item à mettre à jour' }
      },
      required: ['id', 'itemId']
    },
    body: {
      $ref: 'ITodoItem#'
    },
    response: {
      200: {
        description: 'Item mis à jour avec succès',
        $ref: 'ITodoItem#'
      },
      404: {
        description: 'Item non trouvé'
      }
    }
  };