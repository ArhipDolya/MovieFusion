class MovieNotFoundException(Exception):
    """
        Custom exception for movie not found.
    """

    def __init__(self, message="Movie not found"):
        self.message = message
        super().__init__(self.message)